import { useIsLoadedState } from '@/hooks/useIsLoadedState';
import { MATERIAL } from '@/utils/seed/material';

type MaterialPaletteProps = {
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const MaterialPalette = ({ setIsDragging }: MaterialPaletteProps) => {
  const { activeFormat } = useStore();

  return (
    <div
      className={`grid gap-[7px] p-[7px] ${useIsLoadedState() ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
    >
      {MATERIAL.map(({ swatches, name }) => (
        <div className="flex cursor-default gap-[7px]">
          <span className="text-zinc-200" style={{ fontSize: 11, width: 38, lineHeight: 1, margin: 'auto 0' }}>
            {name}
          </span>
          {swatches.map(({ shade, hex, rgb }) => (
            <div
              key={shade}
              className="group grid h-6 w-7 place-items-center text-center transition-transform select-none hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={useOnClickColorTile({ hex, rgb, shade })}
            >
              <div
                className={`h-full w-full pt-[5px] text-[9px] opacity-0 group-hover:opacity-100 ${shade.startsWith('A') ? 'text-black' : Number(shade) < 600 ? 'text-black' : 'text-zinc-200'}`}
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

export default MaterialPalette;
