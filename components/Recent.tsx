import useStore from '@/hooks/useStore';

const Recent = () => {
  const { recent, setRecent } = useStore();

  return (
    <div className="grid gap-1 px-2 pb-1">
      <label className="font-sans text-[11px] tracking-wider text-neutral-400">RECENT</label>
      <div className="flex h-9 flex-wrap gap-[5px]">
        {recent.map(({ hex, rgb }) => (
          <div
            key={hex}
            style={{ backgroundColor: hex }}
            className="group h-4 w-[33px] cursor-pointer pt-[3px] text-center text-[6px] uppercase transition-transform hover:scale-150"
            onClick={async () => {
              await setRecent({ hex, rgb });
              window.close();
              browser.runtime.sendMessage({ color: hex });
            }}
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
