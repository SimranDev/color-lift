export type Option = {
  label: string;
  value: string;
};

export type Swatch = {
  shade: string;
  hex: string;
  rgb: string;
};

export type Color = {
  name: string;
  swatches: Swatch[];
};
