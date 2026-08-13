import type { ColorFormat, Swatch } from '@/types/common';

/** Everything the copy flow needs. Palettes pass a whole `Swatch`, which fits. */
type CopyableSwatch = Pick<Swatch, 'hex' | 'rgb'>;

/**
 * Returns a factory that builds the click handler for a swatch tile.
 *
 * Call this once per palette and reuse the result for every tile. Calling a
 * hook per tile would mount one useStore — and therefore one storage read and
 * one store.watch subscription — for each of the several hundred swatches in a
 * palette.
 */
export function useColorTileHandler(): (swatch: CopyableSwatch, format?: ColorFormat) => () => Promise<void> {
  const { setRecent, activeFormat } = useStore();

  // `format` overrides the toggle for tiles that name their own format — the
  // Match view's readout offers hex, rgb and oklch side by side.
  return (swatch: CopyableSwatch, format: ColorFormat = activeFormat) =>
    async () => {
      const color = formatColor(swatch, format);

      await setRecent({ hex: swatch.hex, rgb: swatch.rgb });
      await navigator.clipboard.writeText(color);
      await browser.runtime.sendMessage({ color });

      // The popup is a one-shot surface: it has nowhere to put a confirmation, so
      // it closes and lets the page toast do the talking. The side panel stays
      // docked next to that same toast, so closing it would throw away the whole
      // reason someone opened the panel instead.
      if (!isSidePanel()) window.close();
    };
}
