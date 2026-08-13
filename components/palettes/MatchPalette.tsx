import { useColorTileHandler } from '@/hooks/useColorTileHandler';
import { findNearestSwatches } from '@/utils/match';
import type { ColorFormat } from '@/types/common';

// Same Chromium-only constraint as the sidebar picker — see components/EyeDropper.tsx.
const CAN_PICK = 'EyeDropper' in window;

const READOUT: ColorFormat[] = ['hex', 'rgb', 'oklch'];

const MatchPalette = () => {
  const { recent } = useStore();
  const createTileHandler = useColorTileHandler();
  const [query, setQuery] = useState('');

  // Open on the last colour that was copied, so the view has something to show
  // straight away. The functional update means it never clobbers typing.
  useEffect(() => {
    setQuery((current) => current || (recent[0]?.hex ?? ''));
  }, [recent]);

  const parsed = parseColorInput(query);
  const matches = useMemo(() => (parsed ? findNearestSwatches(parsed.hex) : []), [parsed?.hex]);

  const pickColor = async () => {
    try {
      const { sRGBHex } = await new (window as any).EyeDropper().open();
      setQuery(sRGBHex);
    } catch {
      // Escape rejects with AbortError. Nothing to do — keep the current query.
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 p-3">
      <div className="grid gap-1">
        <label className="font-sans text-[11px] tracking-wider text-neutral-400" htmlFor="match-input">
          MATCH A COLOUR
        </label>
        <div className="flex items-center gap-2">
          <div
            className="h-9 w-9 shrink-0 rounded-[2px] border border-neutral-700"
            style={{ backgroundColor: parsed?.hex ?? 'transparent' }}
          />
          <input
            id="match-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="#3b82f6, 3b82f6, or rgb(59, 130, 246)"
            spellCheck={false}
            autoComplete="off"
            className="h-9 min-w-0 flex-1 rounded-[2px] border border-neutral-700 bg-neutral-900 px-2 font-mono text-xs text-zinc-200 outline-none focus:border-lime-700"
          />
          {CAN_PICK && (
            <button
              type="button"
              onClick={pickColor}
              title="Pick a colour from the page"
              className="h-9 shrink-0 cursor-pointer rounded-[2px] bg-slate-700 px-3 text-xs text-zinc-200 hover:bg-lime-900"
            >
              Pick
            </button>
          )}
        </div>
      </div>

      {parsed ? (
        <>
          <div className="flex flex-wrap gap-1">
            {READOUT.map((format) => (
              <button
                key={format}
                type="button"
                onClick={createTileHandler(parsed, format)}
                title={`Copy ${format.toUpperCase()}`}
                className="cursor-pointer rounded-[2px] bg-neutral-900 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:bg-neutral-800 hover:text-lime-300"
              >
                {formatColor(parsed, format)}
              </button>
            ))}
          </div>

          <div className="grid gap-1">
            <span className="font-sans text-[11px] tracking-wider text-neutral-400">CLOSEST SWATCHES</span>
            <div className="grid gap-[3px]">
              {matches.map((match) => (
                <div
                  key={`${match.palette}-${match.name}-${match.shade}`}
                  onClick={createTileHandler(match)}
                  title={`Copy ${match.hex}`}
                  className="flex cursor-pointer items-center gap-2 rounded-[2px] bg-neutral-900 py-1 pr-2 pl-1 hover:bg-neutral-800"
                >
                  <div className="h-6 w-10 shrink-0 rounded-[2px]" style={{ backgroundColor: match.hex }} />
                  <span className="w-20 shrink-0 text-[11px] text-neutral-400">{match.paletteLabel}</span>
                  <span className="flex-1 truncate text-xs text-zinc-200">
                    {match.name} {match.shade}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-zinc-400">{match.hex}</span>
                  <span className="w-14 shrink-0 text-right font-mono text-[10px] text-neutral-500">
                    {match.delta === 0 ? 'exact' : `Δ ${match.delta.toFixed(3)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-xs text-neutral-500">
          Paste a colour, or pick one off the page, to find the nearest swatch across all five palettes.
        </p>
      )}
    </div>
  );
};

export default MatchPalette;
