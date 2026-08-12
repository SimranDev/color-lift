import { Swatch } from '@/types/common';

/**
 * Returns a factory that builds the click handler for a swatch tile.
 *
 * Call this once per palette and reuse the result for every tile. Calling a
 * hook per tile would mount one useStore — and therefore one storage read and
 * one store.watch subscription — for each of the several hundred swatches in a
 * palette.
 */
export function useColorTileHandler(): (swatch: Swatch) => () => Promise<void> {
  const { setRecent, activeFormat } = useStore();

  return (swatch: Swatch) => async () => {
    const color = activeFormat === 'hex' ? swatch.hex : swatch.rgb;

    await setRecent({ hex: swatch.hex, rgb: swatch.rgb });
    await navigator.clipboard.writeText(color);
    await browser.runtime.sendMessage({ color });
    window.close();
  };
}
