const PaletteLinks = () => {
  const { activePalette, setActivePalette } = useStore();

  return (
    <>
      <div className="flex flex-col gap-1 @max-xl:order-5 @max-xl:w-full @max-xl:flex-row @max-xl:overflow-x-auto">
        {paletteOptions.map(({ label, value }) => (
          <div
            key={value}
            className={`group flex cursor-pointer items-center justify-end gap-2 pr-3 @max-xl:shrink-0 @max-xl:justify-center @max-xl:rounded-[2px] @max-xl:px-2 @max-xl:pr-2 ${
              activePalette === value
                ? 'text-lime-300 hover:bg-transparent hover:text-lime-300 @max-xl:bg-neutral-800'
                : 'text-zinc-400 hover:bg-neutral-700 hover:text-zinc-200'
            }`}
            onClick={() => setActivePalette(value)}
          >
            {/* The active marker is a left rail in the sidebar. A horizontal strip
                has no left edge to hang it off, so the row background carries it. */}
            <div
              className={`mr-auto ml-2 h-7 w-1 rounded-[2px] @max-xl:hidden ${activePalette === value ? 'bg-lime-800' : ''}`}
            />
            <span className="h-6 pt-[1px] font-sans text-sm tracking-wider @max-xl:text-xs">{label}</span>
          </div>
        ))}
      </div>
      <Divider className="@max-xl:hidden" />
    </>
  );
};

export default PaletteLinks;
