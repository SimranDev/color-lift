import { useOnClickColorTile } from '@/hooks/useOnClickColorTile';
import { RADIX_DARK } from '@/utils/seed/radix-dark';

const RadixDark = () => {
  return (
    <div className="grid gap-[1px] p-1">
      {RADIX_DARK.map(({ swatches, name }) => (
        <div className="flex cursor-default gap-[5px]">
          <span className="text-zinc-200" style={{ fontSize: 11, width: 38, lineHeight: 0.2, margin: 'auto 0' }}>
            {name}
          </span>

          {swatches.map(({ shade, hex, rgb }) => (
            <div
              key={shade}
              className="group h-[18.2px] w-[36.2px] text-center transition-transform hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={useOnClickColorTile({ hex, rgb, shade })}
            >
              <span
                className={`text-center text-[9px] opacity-0 group-hover:opacity-100 ${Number(shade) > 8 ? 'text-black' : 'text-zinc-200'}`}
              >
                {shade}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RadixDark;
