import { useIsLoadedState } from '@/hooks/useIsLoadedState';
import { useColorTileHandler } from '@/hooks/useColorTileHandler';
import { TAILWIND } from '@/utils/seed/tailwind';

type TailwindPaletteProps = {
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const TailwindPalette = ({ setIsDragging }: TailwindPaletteProps) => {
  const { activeFormat } = useStore();
  const createTileHandler = useColorTileHandler();

  return (
    <div
      className={`grid gap-[7px] p-[7px] ${useIsLoadedState() ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
    >
      {TAILWIND.map(({ swatches, name }) => (
        <div key={name} className="flex cursor-default gap-[7px]">
          <span style={{ fontSize: 11, width: 38 }} className="text-zinc-200">
            {name}
          </span>
          {swatches.map(({ shade, hex, rgb }) => (
            <div
              key={shade}
              className="group h-5 w-[37.6px] text-center transition-transform hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={createTileHandler({ hex, rgb, shade })}
            >
              <div
                className={`h-full w-full pt-[3px] text-center text-[9px] opacity-0 group-hover:opacity-100 ${Number(shade) < 600 ? 'text-black' : 'text-zinc-200'}`}
                draggable
                onDragStart={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    return;
                  }
                  setIsDragging(true);
                  e.dataTransfer.setData('text/plain', activeFormat === 'hex' ? hex : rgb);
                }}
                onDragEnd={() => setIsDragging(false)}
              >
                {shade}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TailwindPalette;
