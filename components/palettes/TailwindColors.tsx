import { useOnClickColorTile } from '@/hooks/useOnClickColorTile';
import useStore from '@/hooks/useStore';
import { TAILWIND } from '@/utils/seed/tailwind';

const TailwindColors = () => {
  return (
    <div className="grid gap-[7px] p-[7px]">
      {TAILWIND.map(({ swatches, name }) => (
        <div className="flex cursor-default gap-[7px]">
          <span style={{ fontSize: 11, width: 38 }} className="text-zinc-200">
            {name}
          </span>
          {swatches.map(({ shade, hex, rgb }) => (
            <div
              key={shade}
              className="group h-5 w-[37.6px] text-center transition-transform hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={useOnClickColorTile({ hex, rgb, shade })}
            >
              <span
                className={`text-[9px] opacity-0 group-hover:opacity-100 ${Number(shade) < 600 ? 'text-black' : 'text-zinc-200'}`}
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

export default TailwindColors;
