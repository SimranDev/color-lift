const PaletteLinks = () => {
  const { activePalette, setActivePalette } = useStore();

  return (
    <>
      <div className="flex flex-col gap-1">
        {paletteOptions.map(({ label, value }) => (
          <div
            className={`group flex cursor-pointer items-center justify-end gap-2 pr-3 ${
              activePalette === value
                ? 'text-lime-300 hover:bg-transparent hover:text-lime-300'
                : 'text-zinc-400 hover:bg-neutral-700 hover:text-zinc-200'
            }`}
            onClick={() => setActivePalette(value)}
          >
            <div
              className={`mr-auto ml-2 h-1 w-1 rounded-[2px] px-1 ${activePalette === value ? 'bg-lime-800' : 'group-hover:bg-zinc-800'}`}
            />
            <span className="h-6 pt-[1px] font-sans text-sm tracking-wider">{label}</span>
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default PaletteLinks;
