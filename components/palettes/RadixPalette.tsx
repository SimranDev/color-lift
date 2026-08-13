import { useIsLoadedState } from '@/hooks/useIsLoadedState';
import { useColorTileHandler } from '@/hooks/useColorTileHandler';
import type { Color } from '@/types/common';

type RadixPaletteProps = {
  colors: Color[];
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const RadixPalette = ({ colors, setIsDragging }: RadixPaletteProps) => {
  const { activeFormat } = useStore();
  const createTileHandler = useColorTileHandler();

  return (
    <div
      className={`grid gap-[1px] p-1 ${useIsLoadedState() ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
    >
      {colors.map(({ swatches, name }) => (
        <div key={name} className="flex cursor-default gap-[5px]">
          <span className="text-zinc-200" style={{ fontSize: 11, width: 38, lineHeight: 0.2, margin: 'auto 0' }}>
            {name}
          </span>

          {swatches.map(({ shade, hex, rgb }) => (
            <div
              key={shade}
              className="group h-[18.2px] w-[36.2px] text-center transition-transform hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={createTileHandler({ hex, rgb })}
            >
              <div
                className="h-full w-full pt-[3px] text-center text-[9px] opacity-0 group-hover:opacity-100"
                style={{ color: getContrastColor(hex) }}
                draggable
                onDragStart={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    return;
                  }
                  setIsDragging(true);
                  e.dataTransfer.setData('text/plain', formatColor({ hex, rgb }, activeFormat));
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

export default RadixPalette;
