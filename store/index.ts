import { Palette } from '@/types/enums';
import type { ColorFormat } from '@/types/common';

export type StoredState = {
  recent: { hex: string; rgb: string }[];
  activeFormat: ColorFormat;
  activePalette: Palette;
  favourites: { hex: string; rgb: string }[];
};

export const storageKey = 'local:color-store';

export const store = storage.defineItem<StoredState>(storageKey, {
  fallback: {
    recent: [],
    activeFormat: 'hex',
    activePalette: Palette.TAILWIND,
    favourites: [],
  },
});

export const setRecent = async (recent: { hex: string; rgb: string }[]) => {
  const currentStore = await store.getValue();
  await store.setValue({
    ...currentStore,
    recent,
  });
};

export const setActiveFormat = async (activeFormat: ColorFormat) => {
  const currentStore = await store.getValue();
  await store.setValue({
    ...currentStore,
    activeFormat,
  });
};

export const setActivePalette = async (activePalette: Palette) => {
  const currentStore = await store.getValue();
  await store.setValue({
    ...currentStore,
    activePalette,
  });
};

export const setFavourites = async (favourites: { hex: string; rgb: string }[]) => {
  const currentStore = await store.getValue();
  await store.setValue({
    ...currentStore,
    favourites,
  });
};
