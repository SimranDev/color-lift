import { Swatch } from '@/types/common';

export function useOnClickColorTile(swatch: Swatch): () => Promise<void> {
  const { setRecent, activeFormat } = useStore();

  const color = activeFormat === 'hex' ? swatch.hex : swatch.rgb;

  return async () => {
    await setRecent({ hex: swatch.hex, rgb: swatch.rgb });
    await navigator.clipboard.writeText(color);
    await browser.runtime.sendMessage({ color, shade: swatch.shade });
    window.close();
  };
}
