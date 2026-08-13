import useStore from '@/hooks/useStore';
import { useColorTileHandler } from '@/hooks/useColorTileHandler';

const Recent = () => {
  const { recent } = useStore();
  const createTileHandler = useColorTileHandler();

  return (
    <div className="grid gap-1 px-2 pb-1 @max-xl:order-6 @max-xl:w-full @max-xl:grid-flow-col @max-xl:items-center @max-xl:justify-start @max-xl:gap-2 @max-xl:px-0 @max-xl:pb-0">
      <label className="font-sans text-[11px] tracking-wider text-neutral-400">RECENT</label>
      <div className="flex h-9 flex-wrap gap-[5px] @max-xl:h-4 @max-xl:flex-nowrap">
        {recent.map(({ hex, rgb }) => (
          <div
            key={hex}
            style={{ backgroundColor: hex }}
            className="group h-4 w-[33px] cursor-pointer pt-[3px] text-center text-[6px] uppercase transition-transform hover:scale-150"
            onClick={createTileHandler({ hex, rgb })}
          >
            <span className="opacity-0 group-hover:opacity-100" style={{ color: getContrastColor(hex) }}>
              {hex}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
