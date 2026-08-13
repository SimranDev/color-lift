import favouriteSrc from '@/assets/favourite.svg';
import { Palette } from '@/types/enums';

type FavouritesBtnProps = {
  isDragging: boolean;
};

const FavouritesBtn = ({ isDragging }: FavouritesBtnProps) => {
  const { activePalette, setActivePalette, setFavourites } = useStore();

  return (
    <div
      id="dropzone"
      className={`grid h-12 w-12 cursor-pointer place-items-center rounded-[4px] bg-gradient-to-tr from-slate-900 to-slate-600 hover:from-lime-900 ${activePalette === Palette.FAVOURITES ? 'border-2 border-lime-600' : ''}`}
      onDragOver={(e) => e.preventDefault()} // Allow dropping
      onDrop={async (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (data) {
          const isHex = data.startsWith('#');
          if (isHex) {
            const hex = data;
            const rgb = hexToRgb(hex);
            await setFavourites({ hex: hex, rgb: rgb });
          } else {
            const rgb = data;
            const hex = rgbToHex(rgb);
            await setFavourites({ hex: hex, rgb: rgb });
          }
        }
      }}
      onClick={async () => {
        await setActivePalette(Palette.FAVOURITES);
      }}
    >
      <img src={favouriteSrc} alt="Color Picker" className={`h-8 ${isDragging ? 'animate-bounce' : ''}`} />
    </div>
  );
};

export default FavouritesBtn;
