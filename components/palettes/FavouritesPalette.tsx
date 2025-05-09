import favGifSrc from '@/assets/favourites-howto.gif';

const FavouritesPalette = () => {
  const { favourites, setRecent, activeFormat, removeFavourite } = useStore();
  const [showGif, setShowGif] = useState(false);

  return (
    <div className="relative flex w-full flex-col">
      {showGif && <div className="absolute h-full w-full bg-zinc-400" />}
      <div className="flex h-fit flex-wrap gap-2 p-2">
        {favourites && favourites.length
          ? favourites.map(({ hex, rgb }) => {
              const color = activeFormat === 'hex' ? hex : rgb;
              return (
                <div
                  key={hex}
                  className="group flex h-6 w-17 p-[1px] text-center transition-transform select-none hover:scale-150"
                  style={{ backgroundColor: hex, color: getContrastColor(hex) }}
                  onClick={async () => {
                    await setRecent({ hex: hex, rgb: rgb });
                    await navigator.clipboard.writeText(color);
                    await browser.runtime.sendMessage({ color });
                    window.close();
                  }}
                >
                  <div className={`h-full w-full pt-[5px] text-[8px] opacity-0 group-hover:opacity-100`}>
                    {hex.toUpperCase()}
                  </div>
                  <div
                    className="mt-auto grid h-[13px] w-4 cursor-pointer place-items-center rounded-full bg-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFavourite({ hex, rgb });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 14 14">
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      {(!favourites || (favourites && favourites.length < 10)) && (
        <div className="mx-auto mt-auto grid gap-4 pb-10 text-xs text-zinc-300">
          {showGif && (
            <div className="relative rounded-xs bg-zinc-300 p-2 shadow-2xl shadow-zinc-500">
              <div
                onClick={() => setShowGif(false)}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 transform cursor-pointer rounded-xs border-zinc-500 bg-zinc-200 p-2 font-bold text-slate-800 select-none hover:bg-zinc-100"
              >
                CLOSE
              </div>
              <img src={favGifSrc} alt="gif" className="h-[26rem]" />
            </div>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 24 24"
            className="mx-auto cursor-pointer fill-slate-300 hover:fill-lime-400"
            onClick={() => setShowGif(true)}
          >
            <path d="M15.85 12.425q.225-.15.225-.425t-.225-.425L10.275 8q-.25-.175-.513-.025t-.262.45v7.15q0 .3.263.45t.512-.025zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"></path>
          </svg>
          <span>
            Hold <kbd>Shift</kbd> + <kbd>Left Click</kbd> and drag colour tile to add it to Favourites.
          </span>
        </div>
      )}
    </div>
  );
};

export default FavouritesPalette;
