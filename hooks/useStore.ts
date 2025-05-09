import { setRecent, setActiveFormat, setActivePalette, store, setFavourites } from '@/store';
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
    store.getValue().then(({ recent, activeFormat, activePalette, favourites }) => {
      setRecentState(recent);
      setActiveFormatState(activeFormat);
      setActivePaletteState(activePalette);
      setFavouritesState(favourites);
    });

    const unsubscribe = store.watch(({ recent, activeFormat, activePalette, favourites }) => {
      setRecentState(recent);
      setActiveFormatState(activeFormat);
      setActivePaletteState(activePalette);
      setFavouritesState(favourites);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateRecent = async (newRecent: { hex: string; rgb: string }) => {
    console.log('Updating recent colors:', newRecent);
    setRecentState((prev) => {
      const updatedRecent = [newRecent, ...prev.filter((color) => color.hex !== newRecent.hex)];
      return updatedRecent.slice(0, 6);
    });

    const updatedRecent = await store.getValue().then(({ recent }) => {
      const updated = [
        newRecent,
        ...recent.filter((color: { hex: string; rgb: string }) => color.hex !== newRecent.hex),
      ];
      return updated.slice(0, 6);
    });

    await setRecent(updatedRecent);
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
    console.log('Updating favourites:', fav);
    setFavouritesState((prev) => [fav, ...prev.filter((color) => color.hex !== fav.hex)]);

    const updatedFavourites = await store.getValue().then(({ favourites }) => {
      const updated = [fav, ...favourites.filter((color) => color.hex !== fav.hex)];
      return updated;
    });
    await setFavourites(updatedFavourites);
  };

  const removeFavourite = async (fav: { hex: string; rgb: string }) => {
    setFavouritesState((prev) => prev.filter((color) => color.hex !== fav.hex));

    const updatedFavourites = await store.getValue().then(({ favourites }) => {
      if (favourites && favourites.length) {
        const updated = favourites.filter((color) => color.hex !== fav.hex);
        return updated;
      }
      return [fav];
    });
    await setFavourites(updatedFavourites);
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
