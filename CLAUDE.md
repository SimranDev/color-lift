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
| `utils/seed/radix-dark`  | `RADIX_DARK`  | [components/App.tsx](components/App.tsx)                                           |
| `utils/seed/radix-light` | `RADIX_LIGHT` | [components/App.tsx](components/App.tsx)                                           |

Every swatch carries `hex` **and** `rgb` as pre-computed strings — the UI never converts between them at render time, it just picks the field matching `activeFormat`. The two must stay in sync by hand; `rgb` is formatted `rgb(r, g, b)` with spaces after the commas, which is what `rgbToHex`'s digit-matching and the Favourites drop handler expect.

The third format, `oklch`, is **derived at render time** from `hex` by `hexToOklch` — deliberately not a stored field. A hand-synced third string across 1184 swatches is a maintenance trap, and the conversion is cheap. Note this means an `oklch()` string round-tripped from a Tailwind v4 hex differs from Tailwind's published value by ~0.1% lightness, because the hex is itself a rounded sRGB fallback of an oklch-authored original. That drift is far below a just-noticeable difference; don't "fix" it by hardcoding values.

Both identifiers are load-bearing as React keys: `shade` must be unique within its group, and `name` must be unique within its file. Material previously shipped `Amber` twice (with `Deep Orange` missing entirely), so it's worth re-checking uniqueness after editing seed data.

## Architecture

WXT 0.21 (`wxt.config.ts`, Vite 8 / Rolldown) + React 19 + Tailwind v4 + TypeScript 7, MV3. Four entrypoints under [entrypoints/](entrypoints/):

- **`popup/`** — mounts the shared UI at a fixed 668×600 (`.shell--popup` in [assets/app.css](assets/app.css)).
- **`sidepanel/`** — mounts the same [components/App.tsx](components/App.tsx) at whatever width the user has dragged the panel to (`.shell--panel`). WXT emits this as `side_panel` on Chromium and `sidebar_action` on Firefox, and auto-adds the `sidePanel` permission — neither is declared in `wxt.config.ts`.
- **`background.ts`** — a message relay, nothing else.
- **`toast.content/`** — content script on `*://*/*` that renders the "Copied to clipboard!" toast.

### The copy flow (spans all four entrypoints)

Clicking any swatch runs the handler built by [hooks/useColorTileHandler.ts](hooks/useColorTileHandler.ts): write to `recent` → `navigator.clipboard.writeText` → `browser.runtime.sendMessage({ color })` → `window.close()`, that last step **only in the popup**. The background listener forwards the message to the active tab of the current window, which calls `showToast` from [components/CustomToast.tsx](components/CustomToast.tsx) — a fresh `createRoot` mounted into a bare `<div>` on the host page that self-removes after 4s. That toast is styled with inline styles only, because it renders on arbitrary sites where the extension's Tailwind is not loaded; keep it that way.

Nothing renders if the active tab is a `chrome://` page, the Web Store, or anywhere else the content script cannot run. The clipboard write still succeeds — only the confirmation is missing.

`host_permissions` for `https://*/*` and `http://*/*` exist solely so `browser.tabs.sendMessage` can reach those content scripts.

The popup reaches the panel through the pop-out button in [components/Footer.tsx](components/Footer.tsx). `sidePanel.open()` must run inside the click's user gesture, so the window id is fetched on mount rather than awaited in the handler, and the call is deliberately not awaited — opening the panel takes focus off the popup, which closes it, leaving the promise unsettled. Firefox has no `sidePanel` API, so the same button feature-detects `sidebarAction` first.

The two surfaces have opposite lifecycles, and `isSidePanel()` in [utils/surface.ts](utils/surface.ts) is what separates them — it sniffs `location.pathname` for `sidepanel`, because WXT emits the entrypoint as `sidepanel.html` at the bundle root. That beats threading a React context through every component that copies a colour. Every copy path goes through `useColorTileHandler`, so the close-vs-stay-open decision lives in exactly one place; **don't reintroduce a bare `window.close()`** in a component. `Recent`, `FavouritesPalette` and `EyeDropper` each used to hand-roll their own copy and are now callers of that hook.

A declared content script only reaches pages that load _after_ it is registered, so every tab already open at install or update time would otherwise have no listener — the first copy silently shows no toast until that tab happens to reload. The `onInstalled` handler in [entrypoints/background.ts](entrypoints/background.ts) closes that gap by injecting into existing `http(s)` tabs via `browser.scripting.executeScript`; that is the only reason the `scripting` permission is in `wxt.config.ts`. It derives the file list from `browser.runtime.getManifest().content_scripts` and prefixes each path with `/`, because WXT types `executeScript`'s `files` as `ScriptPublicPath` — the generated union in `.wxt/types/paths.d.ts`, whose members are rooted while the manifest's are relative. A tab that loads mid-injection would end up with two listeners, so `toast.content/index.ts` guards on a `window.__colorLiftToastReady` flag.

### Eye dropper

[components/EyeDropper.tsx](components/EyeDropper.tsx) uses `window.EyeDropper`, which is **Chromium-only** — Firefox has no implementation and [no committed plan](https://github.com/mozilla/standards-positions/issues/557) for one. The component feature-detects once at module scope and renders a disabled tile with an explanatory `title` on Firefox, rather than attaching a handler that fails after the click.

This is a decision, not an oversight: the screenshot-and-canvas workaround (`tabs.captureVisibleTab` + an overlay content script) can only sample the active tab's viewport, never the other applications this extension exists to pick colours from, and `getDisplayMedia` costs a screen-share prompt on every pick. Neither was judged worth it for the Firefox install base. Don't add a fallback without revisiting that trade.

The tile stays rendered rather than hidden because it shares a `justify-between` row with `FavouritesBtn` in [components/App.tsx](components/App.tsx); removing it would slide the heart button to the left edge.

`PickingColorPopup` — the shrunken "PICK A COLOUR" hint — renders **only in the popup**, where the window would otherwise cover the page being picked from. The side panel is docked out of the way already, so it keeps showing the palette while the picker is open.

### State

One WXT storage item, `local:color-store`, defined in [store/index.ts](store/index.ts) — `recent` (capped at 6), `favourites`, `activeFormat`, `activePalette`. The setters there are whole-object read-modify-write, so concurrent writes to different fields can clobber each other.

`activeFormat` is the `ColorFormat` union in [types/common.ts](types/common.ts) (`hex | rgb | oklch`), and the popup and side panel share one storage item — so changing the format or palette in one surface immediately updates the other through `store.watch`.

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

`Palette.MATCH` rides that same mechanism without being a palette: [components/palettes/MatchPalette.tsx](components/palettes/MatchPalette.tsx) takes a pasted or eyedropped colour and ranks every seed swatch by perceptual distance. The index in [utils/match.ts](utils/match.ts) precomputes OKLab coordinates for all 1184 swatches once at module load, because the view re-searches on every keystroke. Distance is `deltaEOk` — plain Euclidean distance in OKLab, which is only meaningful because OKLab is perceptually uniform; **don't** substitute RGB distance.

Tile click handlers come from `useColorTileHandler()`, which each palette calls **once** and then reuses: `const createTileHandler = useColorTileHandler();` at the top, `onClick={createTileHandler(swatch)}` inside the map. `createTileHandler` is a plain function, not a hook — do not inline the hook into the map. Doing so mounts one `useStore` per swatch (336 on Radix), which is both a Rules-of-Hooks violation and the performance bug described above.

### Favourites

Shift+drag a swatch onto the heart button (`id="dropzone"`, [components/FavouritesBtn.tsx](components/FavouritesBtn.tsx)). `onDragStart` in each palette calls `e.preventDefault()` unless `e.shiftKey` is held, so plain dragging is inert. The drop handler receives only a `text/plain` string and recovers the missing format by sniffing a leading `#` and converting via `hexToRgb`/`rgbToHex`.

## Conventions

- Tailwind v4, CSS-first: no `tailwind.config.js` — the entire config is `@import 'tailwindcss'` in [assets/tailwind.css](assets/tailwind.css), wired through the `@tailwindcss/vite` plugin.
- Dark UI, lime accents for active/hover states. Text color over a swatch comes from `getContrastColor(hex)`, not from Tailwind classes.
- Conventional commit prefixes (`feat:`, `fix:`, `chore:`).
- Bump `version` in `package.json` before packaging — WXT derives the manifest version from it.
