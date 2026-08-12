import { setRecent, setActiveFormat, setActivePalette, store, setFavourites, type StoredState } from '@/store';
import { useEffect, useState } from 'react';
import { Palette } from '@/types/enums';

type Store = {
  recent: { hex: string; rgb: string }[];
  setRecent: (recent: { hex: string; rgb: string }) => Promise<void>;
  activeFormat: 'hex' | 'rgb';
  setActiveFormat: (format: 'hex' | 'rgb') => Promise<void>;
  activePalette: Palette;
  setActivePalette: (palette: Palette) => Promise<void>;
  favourites: { hex: string; rgb: string }[];
  setFavourites: (favourites: { hex: string; rgb: string }) => Promise<void>;
  removeFavourite: (favourite: { hex: string; rgb: string }) => Promise<void>;
};

function useStore(): Store {
  const [recent, setRecentState] = useState<Store['recent']>([]);
  const [activeFormat, setActiveFormatState] = useState<Store['activeFormat']>('hex');
  const [activePalette, setActivePaletteState] = useState<Store['activePalette']>(Palette.TAILWIND);
  const [favourites, setFavouritesState] = useState<Store['favourites']>([]);

  useEffect(() => {
    // storage.defineItem's fallback covers a missing item, not missing keys, so
    // an install that predates a field still reads it back as undefined.
    const applySnapshot = ({ recent, activeFormat, activePalette, favourites }: Partial<StoredState>) => {
      setRecentState(recent ?? []);
      setActiveFormatState(activeFormat ?? 'hex');
      setActivePaletteState(activePalette ?? Palette.TAILWIND);
      setFavouritesState(favourites ?? []);
    };

    store.getValue().then(applySnapshot);
    const unsubscribe = store.watch(applySnapshot);

    return () => {
      unsubscribe();
    };
  }, []);

  const updateRecent = async (newRecent: { hex: string; rgb: string }) => {
    setRecentState((prev) => {
      const updatedRecent = [newRecent, ...prev.filter((color) => color.hex !== newRecent.hex)];
      return updatedRecent.slice(0, 6);
    });

    const { recent } = await store.getValue();
    const updatedRecent = [newRecent, ...(recent ?? []).filter((color) => color.hex !== newRecent.hex)];

    await setRecent(updatedRecent.slice(0, 6));
  };

  const updateActiveFormat = async (format: 'hex' | 'rgb') => {
    setActiveFormatState(format);
    await setActiveFormat(format);
  };

  const updateActivePalette = async (palette: Palette) => {
    setActivePaletteState(palette);
    await setActivePalette(palette);
  };

  const updateFavourites = async (fav: { hex: string; rgb: string }) => {
    setFavouritesState((prev) => [fav, ...prev.filter((color) => color.hex !== fav.hex)]);

    const { favourites } = await store.getValue();
    await setFavourites([fav, ...(favourites ?? []).filter((color) => color.hex !== fav.hex)]);
  };

  const removeFavourite = async (fav: { hex: string; rgb: string }) => {
    setFavouritesState((prev) => prev.filter((color) => color.hex !== fav.hex));

    const { favourites } = await store.getValue();
    await setFavourites((favourites ?? []).filter((color) => color.hex !== fav.hex));
  };

  return {
    recent,
    setRecent: updateRecent,
    activeFormat,
    setActiveFormat: updateActiveFormat,
    activePalette,
    setActivePalette: updateActivePalette,
    favourites,
    setFavourites: updateFavourites,
    removeFavourite,
  };
}

export default useStore;
