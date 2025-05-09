import { Palette } from '@/types/enums';

type Store = {
  recent: { hex: string; rgb: string }[];
  activeFormat: 'hex' | 'rgb';
  activePalette: Palette;
  favourites: { hex: string; rgb: string }[];
};

export const storageKey = 'local:color-store';

export const store = storage.defineItem<Store>(storageKey, {
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

export const setActiveFormat = async (activeFormat: 'hex' | 'rgb') => {
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
  console.log('Updating favourites:', favourites);
  const currentStore = await store.getValue();
  await store.setValue({
    ...currentStore,
    favourites,
  });
};
