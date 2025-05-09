import { useState } from 'react';
import { Palette } from '@/types/enums';
import Logo from '@/components/Logo';
import PickingColorPopup from '@/components/PickingColorPopup';
import FormatToggle from '@/components/FormatToggle';
import Divider from '@/components/Divider';
import Footer from '@/components/Footer';
import Recent from '@/components/Recent';
import PaletteLinks from '@/components/PaletteLinks';
import EyeDropper from '@/components/EyeDropper';
import FavouritesBtn from '@/components/FavouritesBtn';
import FavouritesPalette from '@/components/palettes/FavouritesPalette';
import TailwindPalette from '@/components/palettes/TailwindColors';
import MaterialPalette from '@/components/palettes/MaterialPalette';
import RadixPalette from '@/components/palettes/RadixPalette';
import { RADIX_DARK } from '@/utils/seed/radix-dark';
import { RADIX_LIGHT } from '@/utils/seed/radix-light';
import NordPalette from '@/components/palettes/NordPalette';

function App() {
  const [pickingColor, setPickingColor] = useState(false);
  const { activePalette } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <main>
      {pickingColor ? (
        <PickingColorPopup />
      ) : (
        <div className="popup">
          <div className="flex max-w-32 flex-col gap-2 border-r border-neutral-800 bg-gradient-to-r from-slate-800 to-stone-950 pt-1">
            <Logo />
            <FormatToggle />
            <Divider />
            <PaletteLinks />

            <div className="mt-auto flex justify-between px-[10px] pb-1">
              <EyeDropper setPickingColor={setPickingColor} />
              <FavouritesBtn isDragging={isDragging} />
            </div>

            <Divider />
            <Recent />
            <Divider />
            <Footer />
          </div>

          {activePalette === Palette.TAILWIND && <TailwindPalette setIsDragging={setIsDragging} />}
          {activePalette === Palette.MATERIAL && <MaterialPalette setIsDragging={setIsDragging} />}
          {activePalette === Palette.RADIX_DARK && <RadixPalette colors={RADIX_DARK} setIsDragging={setIsDragging} />}
          {activePalette === Palette.RADIX_LIGHT && <RadixPalette colors={RADIX_LIGHT} setIsDragging={setIsDragging} />}
          {activePalette === Palette.NORD && <NordPalette setIsDragging={setIsDragging} />}
          {activePalette === Palette.FAVOURITES && <FavouritesPalette />}
        </div>
      )}
    </main>
  );
}

export default App;
