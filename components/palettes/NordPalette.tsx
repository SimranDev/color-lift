import { NORD } from '@/utils/seed/nord';

type NordPaletteProps = {
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const NordPalette = ({ setIsDragging }: NordPaletteProps) => {
  const { activeFormat } = useStore();

  return (
    <div
      className={`grid h-fit gap-2 p-2 transition-opacity duration-1000 ${useIsLoadedState() ? 'opacity-100' : 'opacity-0'}`}
    >
      {NORD.map(({ swatches, name }) => (
        <div className="flex h-fit cursor-default items-center gap-2">
          <span className="w-18 text-xs text-zinc-200">{name}</span>
          {swatches.map(({ shade, hex, rgb }) => (
            <div
              key={shade}
              className="group grid h-9 w-20 place-items-center text-center transition-transform select-none hover:scale-125"
              style={{ backgroundColor: hex }}
              onClick={useOnClickColorTile({ hex, rgb, shade })}
            >
              <div
                className="h-full w-full pt-[11px] text-center text-[9px] opacity-0 group-hover:opacity-100"
                style={{ color: getContrastColor(hex) }}
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

export default NordPalette;
