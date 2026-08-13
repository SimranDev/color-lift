import type { ColorFormat, Option } from '@/types/common';
import { Palette } from '@/types/enums';

export const paletteOptions: Option<Palette>[] = [
  { label: 'Tailwind', value: Palette.TAILWIND },
  { label: 'Material', value: Palette.MATERIAL },
  { label: 'Radix Dark', value: Palette.RADIX_DARK },
  { label: 'Radix Light', value: Palette.RADIX_LIGHT },
  { label: 'Nord', value: Palette.NORD },
  { label: 'Match', value: Palette.MATCH },
];

export const formatOptions: Option<ColorFormat>[] = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' },
  { label: 'OKLCH', value: 'oklch' },
];
