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
pnpm compile          # tsc --noEmit — the only checking step
```

There is no test suite and no lint script. Prettier is configured (`.prettierrc`, with `prettier-plugin-tailwindcss`) but has no npm script — invoke `pnpm exec prettier` directly.

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

Every swatch carries `hex` **and** `rgb` as pre-computed strings — the UI never converts between them at render time, it just picks the field matching `activeFormat`. The two must stay in sync by hand; `rgb` is formatted `rgb(r, g, b)` with spaces after the commas, which is what `rgbToHex`'s digit-matching and the Favourites drop handler expect. `shade` doubles as the React `key`, so it must be unique within its group.

## Architecture

WXT (`wxt.config.ts`) + React 19 + Tailwind v4, MV3. Three entrypoints under [entrypoints/](entrypoints/):

- **`popup/`** — the whole UI. Fixed 668×600 (`.popup` in [entrypoints/popup/style.css](entrypoints/popup/style.css)).
- **`background.ts`** — a message relay, nothing else.
- **`toast.content/`** — content script on `*://*/*` that renders the "Copied to clipboard!" toast.

### The copy flow (spans all three entrypoints)

Clicking any swatch runs [hooks/useOnClickColorTile.ts](hooks/useOnClickColorTile.ts): write to `recent` → `navigator.clipboard.writeText` → `browser.runtime.sendMessage({ color })` → `window.close()`. The background listener then queries **every** tab matching `*://*/*` and forwards the message to each one, so the toast is broadcast to all open tabs, not just the active one. Each content script calls `showToast` from [components/CustomToast.tsx](components/CustomToast.tsx), which mounts a fresh `createRoot` into a bare `<div>` on the host page and self-removes after 4s. That toast is styled with inline styles only — it renders on arbitrary sites where the extension's Tailwind is not loaded, so keep it that way.

`host_permissions` for `https://*/*` and `http://*/*` exist solely so `browser.tabs.sendMessage` can reach those content scripts.

### State

One WXT storage item, `local:color-store`, defined in [store/index.ts](store/index.ts) — `recent` (capped at 6), `favourites`, `activeFormat`, `activePalette`. The setters there are whole-object read-modify-write, so concurrent writes to different fields can clobber each other.

[hooks/useStore.ts](hooks/useStore.ts) is the only thing components touch. It mirrors the storage item into React state, subscribes with `store.watch`, and each of its updaters writes optimistically to local state _and_ re-reads storage before persisting. It is a plain hook with no shared context — every component calling `useStore()` holds its own copy of the state, kept in sync only by the `store.watch` subscription.

### Auto-imports

WXT auto-imports everything from `components/`, `hooks/`, and `utils/` (default exports by filename, plus named exports), so `useStore`, `getContrastColor`, `hexToRgb`, `paletteOptions`, `Divider`, `useState`/`useEffect`, `browser`, and `storage` are used **without import statements** throughout. `types/` and `store/` are _not_ auto-imported and must be imported explicitly. The generated declarations live in `.wxt/types/imports.d.ts`. Follow the existing style rather than adding imports for auto-imported symbols; note the codebase is inconsistent here (e.g. [components/Recent.tsx](components/Recent.tsx) imports `useStore` explicitly while its siblings don't).

### Palettes

Each palette is its own component under [components/palettes/](components/palettes/) with hardcoded tile sizes, because the color sets have different shape (Nord has few wide swatches; Tailwind/Material are dense grids). `RadixPalette` is the only generic one — it takes `colors: Color[]` and serves both Radix Dark and Radix Light. `App.tsx` switches on `activePalette` with a chain of `&&` conditionals.

Adding a palette means touching four places: the `Palette` enum in [types/enums.ts](types/enums.ts), `paletteOptions` in [utils/options.ts](utils/options.ts) (this drives the sidebar links), a component, and the conditional chain in `App.tsx`.

Palettes call `useOnClickColorTile(...)` inside `.map()` callbacks as the `onClick` value. This is a Rules-of-Hooks violation that happens to work only because the seed arrays are constant-length — do not make palette rendering conditional or variable-length without restructuring that call first.

### Favourites

Shift+drag a swatch onto the heart button (`id="dropzone"`, [components/FavouritesBtn.tsx](components/FavouritesBtn.tsx)). `onDragStart` in each palette calls `e.preventDefault()` unless `e.shiftKey` is held, so plain dragging is inert. The drop handler receives only a `text/plain` string and recovers the missing format by sniffing a leading `#` and converting via `hexToRgb`/`rgbToHex`.

## Conventions

- Tailwind v4, CSS-first: no `tailwind.config.js` — the entire config is `@import 'tailwindcss'` in [assets/tailwind.css](assets/tailwind.css), wired through the `@tailwindcss/vite` plugin.
- Dark UI, lime accents for active/hover states. Text color over a swatch comes from `getContrastColor(hex)`, not from Tailwind classes.
- Conventional commit prefixes (`feat:`, `fix:`, `chore:`).
- Bump `version` in `package.json` before packaging — WXT derives the manifest version from it.
