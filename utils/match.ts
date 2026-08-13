import type { Color } from '@/types/common';
import { Palette } from '@/types/enums';
import { deltaEOk, hexToOklab, type Oklab } from './util-fns';
import { TAILWIND } from './seed/tailwind';
import { MATERIAL } from './seed/material';
import { NORD } from './seed/nord';
import { RADIX_DARK } from './seed/radix-dark';
import { RADIX_LIGHT } from './seed/radix-light';

export type SwatchMatch = {
  palette: Palette;
  paletteLabel: string;
  name: string;
  shade: string;
  hex: string;
  rgb: string;
  /** Perceptual distance from the queried colour. 0 means the seed data has it exactly. */
  delta: number;
};

type IndexedSwatch = Omit<SwatchMatch, 'delta'> & { oklab: Oklab };

const SOURCES: { palette: Palette; label: string; colors: Color[] }[] = [
  { palette: Palette.TAILWIND, label: 'Tailwind', colors: TAILWIND },
  { palette: Palette.MATERIAL, label: 'Material', colors: MATERIAL },
  { palette: Palette.RADIX_DARK, label: 'Radix Dark', colors: RADIX_DARK },
  { palette: Palette.RADIX_LIGHT, label: 'Radix Light', colors: RADIX_LIGHT },
  { palette: Palette.NORD, label: 'Nord', colors: NORD },
];

/**
 * Every seed swatch with its OKLab coordinates, computed once at module load
 * rather than per query — the view re-searches on every keystroke.
 */
const INDEX: IndexedSwatch[] = SOURCES.flatMap(({ palette, label, colors }) =>
  colors.flatMap(({ name, swatches }) =>
    swatches.map(({ shade, hex, rgb }) => ({
      palette,
      paletteLabel: label,
      name,
      shade,
      hex,
      rgb,
      oklab: hexToOklab(hex),
    }))
  )
);

/** The seed swatches that look closest to `hex`, nearest first. */
export function findNearestSwatches(hex: string, limit = 10): SwatchMatch[] {
  const target = hexToOklab(hex);

  return INDEX.map(({ oklab, ...swatch }) => ({ ...swatch, delta: deltaEOk(target, oklab) }))
    .sort((first, second) => first.delta - second.delta)
    .slice(0, limit);
}
