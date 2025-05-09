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
