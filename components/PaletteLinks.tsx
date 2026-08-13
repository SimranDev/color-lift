import { Palette } from '@/types/enums';

// Favourites is reached through the heart button, so it is deliberately absent
// from paletteOptions and the sidebar rail. A dropdown is a complete list of
// views though, and omitting it would leave the select showing a stale label
// whenever Favourites is active.
const dropdownOptions = [...paletteOptions, { label: 'Favourites', value: Palette.FAVOURITES }];

const PaletteLinks = () => {
  const { activePalette, setActivePalette } = useStore();

  return (
    <>
      {/* Both the select and the rail render; the container query picks one.
          Cheaper than branching on width in JS, which would need a observer. */}
      <select
        value={activePalette}
        onChange={(event) => setActivePalette(event.target.value as Palette)}
        aria-label="Palette"
        className="hidden @max-xl:order-2 @max-xl:block @max-xl:h-7 @max-xl:min-w-28 @max-xl:flex-1 @max-xl:rounded-[2px] @max-xl:border @max-xl:border-neutral-700 @max-xl:bg-slate-700 @max-xl:px-1 @max-xl:text-xs @max-xl:text-zinc-200"
      >
        {dropdownOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-1 @max-xl:hidden">
        {paletteOptions.map(({ label, value }) => (
          <div
            key={value}
            className={`group flex cursor-pointer items-center justify-end gap-2 pr-3 ${
              activePalette === value
                ? 'text-lime-300 hover:bg-transparent hover:text-lime-300'
                : 'text-zinc-400 hover:bg-neutral-700 hover:text-zinc-200'
            }`}
            onClick={() => setActivePalette(value)}
          >
            <div className={`mr-auto ml-2 h-7 w-1 rounded-[2px] ${activePalette === value ? 'bg-lime-800' : ''}`} />
            <span className="h-6 pt-[1px] font-sans text-sm tracking-wider">{label}</span>
          </div>
        ))}
      </div>
      <Divider className="@max-xl:hidden" />
    </>
  );
};

export default PaletteLinks;
