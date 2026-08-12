# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # also runs `wxt prepare`, which regenerates .wxt/ (types + auto-imports)
pnpm dev              # Chrome dev server with HMR; launches a browser with the extension loaded
pnpm dev:firefox
pnpm build            # -> .output/chrome-mv3/  (README says `dist`; it is actually .output/)
pnpm build:firefox
pnpm zip              # packaged artifact for store upload
pnpm compile          # tsc --noEmit — the only correctness gate
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
```

There is no test suite and no linter. `pnpm compile` plus `pnpm format:check` is the whole check surface.

If types/auto-imports look wrong after adding a file under `components/`, `hooks/`, or `utils/`, run `pnpm exec wxt prepare` to regenerate `.wxt/`.

## Seed data

`utils/seed/` holds all 1184 color swatches across five modules, each exporting a `Color[]` (see [types/common.ts](types/common.ts)):

| Module                   | Named export  | Imported by                                                                        |
| ------------------------ | ------------- | ---------------------------------------------------------------------------------- |
| `utils/seed/tailwind`    | `TAILWIND`    | [components/palettes/TailwindColors.tsx](components/palettes/TailwindColors.tsx)   |
| `utils/seed/material`    | `MATERIAL`    | [components/palettes/MaterialPalette.tsx](components/palettes/MaterialPalette.tsx) |
| `utils/seed/nord`        | `NORD`        | [components/palettes/NordPalette.tsx](components/palettes/NordPalette.tsx)         |
| `utils/seed/radix-dark`  | `RADIX_DARK`  | [entrypoints/popup/App.tsx](entrypoints/popup/App.tsx)                             |
| `utils/seed/radix-light` | `RADIX_LIGHT` | [entrypoints/popup/App.tsx](entrypoints/popup/App.tsx)                             |

Every swatch carries `hex` **and** `rgb` as pre-computed strings — the UI never converts between them at render time, it just picks the field matching `activeFormat`. The two must stay in sync by hand; `rgb` is formatted `rgb(r, g, b)` with spaces after the commas, which is what `rgbToHex`'s digit-matching and the Favourites drop handler expect.

Both identifiers are load-bearing as React keys: `shade` must be unique within its group, and `name` must be unique within its file. Material previously shipped `Amber` twice (with `Deep Orange` missing entirely), so it's worth re-checking uniqueness after editing seed data.

## Architecture

WXT 0.21 (`wxt.config.ts`, Vite 8 / Rolldown) + React 19 + Tailwind v4 + TypeScript 7, MV3. Three entrypoints under [entrypoints/](entrypoints/):

- **`popup/`** — the whole UI. Fixed 668×600 (`.popup` in [entrypoints/popup/style.css](entrypoints/popup/style.css)).
- **`background.ts`** — a message relay, nothing else.
- **`toast.content/`** — content script on `*://*/*` that renders the "Copied to clipboard!" toast.

### The copy flow (spans all three entrypoints)

Clicking any swatch runs the handler built by [hooks/useColorTileHandler.ts](hooks/useColorTileHandler.ts): write to `recent` → `navigator.clipboard.writeText` → `browser.runtime.sendMessage({ color })` → `window.close()`. The background listener forwards the message to the active tab of the current window, which calls `showToast` from [components/CustomToast.tsx](components/CustomToast.tsx) — a fresh `createRoot` mounted into a bare `<div>` on the host page that self-removes after 4s. That toast is styled with inline styles only, because it renders on arbitrary sites where the extension's Tailwind is not loaded; keep it that way.

Nothing renders if the active tab is a `chrome://` page, the Web Store, or anywhere else the content script cannot run. The clipboard write still succeeds — only the confirmation is missing.

`host_permissions` for `https://*/*` and `http://*/*` exist solely so `browser.tabs.sendMessage` can reach those content scripts.

### State

One WXT storage item, `local:color-store`, defined in [store/index.ts](store/index.ts) — `recent` (capped at 6), `favourites`, `activeFormat`, `activePalette`. The setters there are whole-object read-modify-write, so concurrent writes to different fields can clobber each other.

`storage.defineItem`'s `fallback` only covers a **missing item, not missing keys**. An install predating a field reads that field back as `undefined`, so `useStore` defaults every field as it hydrates. Don't assume a field is populated just because the type says so.

[hooks/useStore.ts](hooks/useStore.ts) is the only thing components touch. It mirrors the storage item into React state, subscribes with `store.watch`, and each updater writes optimistically to local state _and_ re-reads storage before persisting. It is a plain hook with no shared context — every component calling `useStore()` holds its own copy of the state, kept in sync only by the `store.watch` subscription.

That last point sets a real budget: **each `useStore()` is one storage read plus one live watcher**, and every write fans out to all of them. Keep calls proportional to components, never to data. Palettes render hundreds of tiles, so a hook called per tile is a performance bug — see below.

### Type-only imports are mandatory

WXT's generated tsconfig sets `verbatimModuleSyntax`, and the Rolldown bundler enforces it too. Importing a type as a value fails **both** `tsc` (`TS1484`) and the build (`MISSING_EXPORT`) — the build error is the confusing one, since it claims an export is missing when it plainly exists.

Use `import type { Color } from '@/types/common'` when everything in the statement is a type, and the inline modifier — `import { defineConfig, type WxtViteConfig } from 'wxt'` — when a statement mixes values and types. Note `Palette` in [types/enums.ts](types/enums.ts) is an `enum`, which is a real runtime value: import it normally, never as a type.

### Auto-imports

WXT auto-imports everything from `components/`, `hooks/`, and `utils/` (default exports by filename, plus named exports), so `useStore`, `getContrastColor`, `hexToRgb`, `paletteOptions`, `Divider`, `useState`/`useEffect`, `browser`, and `storage` are used **without import statements** throughout. `types/` and `store/` are _not_ auto-imported and must be imported explicitly. The generated declarations live in `.wxt/types/imports.d.ts`. Follow the existing style rather than adding imports for auto-imported symbols; note the codebase is inconsistent here (e.g. [components/Recent.tsx](components/Recent.tsx) imports `useStore` explicitly while its siblings don't).

### Palettes

Each palette is its own component under [components/palettes/](components/palettes/) with hardcoded tile sizes, because the color sets have different shape (Nord has few wide swatches; Tailwind/Material are dense grids). `RadixPalette` is the only generic one — it takes `colors: Color[]` and serves both Radix Dark and Radix Light. `App.tsx` switches on `activePalette` with a chain of `&&` conditionals.

Adding a palette means touching four places: the `Palette` enum in [types/enums.ts](types/enums.ts), `paletteOptions` in [utils/options.ts](utils/options.ts) (this drives the sidebar links), a component, and the conditional chain in `App.tsx`.

Tile click handlers come from `useColorTileHandler()`, which each palette calls **once** and then reuses: `const createTileHandler = useColorTileHandler();` at the top, `onClick={createTileHandler(swatch)}` inside the map. `createTileHandler` is a plain function, not a hook — do not inline the hook into the map. Doing so mounts one `useStore` per swatch (336 on Radix), which is both a Rules-of-Hooks violation and the performance bug described above.

### Favourites

Shift+drag a swatch onto the heart button (`id="dropzone"`, [components/FavouritesBtn.tsx](components/FavouritesBtn.tsx)). `onDragStart` in each palette calls `e.preventDefault()` unless `e.shiftKey` is held, so plain dragging is inert. The drop handler receives only a `text/plain` string and recovers the missing format by sniffing a leading `#` and converting via `hexToRgb`/`rgbToHex`.

## Conventions

- Tailwind v4, CSS-first: no `tailwind.config.js` — the entire config is `@import 'tailwindcss'` in [assets/tailwind.css](assets/tailwind.css), wired through the `@tailwindcss/vite` plugin.
- Dark UI, lime accents for active/hover states. Text color over a swatch comes from `getContrastColor(hex)`, not from Tailwind classes.
- Conventional commit prefixes (`feat:`, `fix:`, `chore:`).
- Bump `version` in `package.json` before packaging — WXT derives the manifest version from it.
