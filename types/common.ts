export type Option<T> = {
  label: string;
  value: T;
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
