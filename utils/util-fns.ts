import type { ColorFormat } from '@/types/common';

export function getContrastColor(color: string) {
  const hex = color.startsWith('#') ? color : rgbToHex(color);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate the luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
export function rgbToHex(rgb: string) {
  const rgbArray = rgb.match(/\d+/g);
  if (!rgbArray || rgbArray.length < 3) return '#000000';
  const hex = rgbArray
    .map((x) => {
      const hexValue = parseInt(x).toString(16);
      return hexValue.length === 1 ? '0' + hexValue : hexValue;
    })
    .join('');
  return `#${hex}`;
}

export function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export type Oklab = { L: number; a: number; b: number };

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Expands `#abc` to `#aabbcc` and puts the `#` back on, so everything below can
 * assume the six-digit form the seed data uses.
 */
function normaliseHex(hex: string) {
  const digits = hex.trim().replace('#', '').toLowerCase();
  if (digits.length === 3) return `#${digits[0]}${digits[0]}${digits[1]}${digits[1]}${digits[2]}${digits[2]}`;
  return `#${digits}`;
}

function srgbToLinear(value: number) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function round(value: number, places: number) {
  return Number(value.toFixed(places));
}

/**
 * sRGB to OKLab, using Björn Ottosson's reference matrices.
 *
 * OKLab is perceptually uniform, which is the whole point: plain Euclidean
 * distance in it (see `deltaEOk`) is a usable "how different do these two look
 * to a human" number, which distance in RGB very much is not.
 */
export function hexToOklab(hex: string): Oklab {
  const normalised = normaliseHex(hex);
  const r = srgbToLinear(parseInt(normalised.slice(1, 3), 16));
  const g = srgbToLinear(parseInt(normalised.slice(3, 5), 16));
  const b = srgbToLinear(parseInt(normalised.slice(5, 7), 16));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/**
 * A CSS Color 4 `oklch()` string, written the way Tailwind v4 and Radix ship
 * theirs: percentage lightness, then chroma, then hue in degrees.
 */
export function hexToOklch(hex: string) {
  const { L, a, b } = hexToOklab(hex);
  const chroma = Math.sqrt(a * a + b * b);
  // Hue is meaningless for greys, where a and b are both ~0 and atan2 returns
  // whatever the floating point noise happens to be. CSS wants 0 there.
  const hue = chroma < 1e-4 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;

  return `oklch(${round(L * 100, 1)}% ${round(chroma, 3)} ${round(hue, 3)})`;
}

/** Perceptual distance between two colours. 0 is identical; ~0.02 is a just-noticeable difference. */
export function deltaEOk(first: Oklab, second: Oklab) {
  return Math.hypot(first.L - second.L, first.a - second.a, first.b - second.b);
}

/**
 * Picks the string to put on the clipboard for a swatch. `hex` and `rgb` are
 * pre-computed in the seed data; `oklch` is derived, because keeping a third
 * hand-synced string across 1184 swatches would be a maintenance trap.
 */
export function formatColor({ hex, rgb }: { hex: string; rgb: string }, format: ColorFormat) {
  if (format === 'rgb') return rgb;
  if (format === 'oklch') return hexToOklch(hex);
  return hex;
}

/**
 * Accepts what someone is realistically going to paste — `#3b82f6`, `3b82f6`,
 * `#38f`, `rgb(59, 130, 246)` — and returns the {hex, rgb} pair the rest of the
 * app passes around. Returns null rather than a fallback colour so callers can
 * stay quiet until the input is actually a colour.
 */
export function parseColorInput(input: string): { hex: string; rgb: string } | null {
  const value = input.trim();
  if (!value) return null;

  if (HEX_PATTERN.test(value)) {
    const hex = normaliseHex(value);
    return { hex, rgb: hexToRgb(hex) };
  }

  const channels = value.match(/\d+/g);
  if (!value.toLowerCase().startsWith('rgb') || !channels || channels.length < 3) return null;

  const r = Number(channels[0]);
  const g = Number(channels[1]);
  const b = Number(channels[2]);
  if (r > 255 || g > 255 || b > 255) return null;

  const rgb = `rgb(${r}, ${g}, ${b})`;
  return { hex: rgbToHex(rgb), rgb };
}
