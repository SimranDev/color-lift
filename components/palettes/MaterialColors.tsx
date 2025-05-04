import { MATERIAL } from '@/utils/seed/material';

const MaterialColors = () => {
  return (
    <div className="grid gap-[7px] p-[7px]">
      {MATERIAL.map(({ swatches, name }) => (
        <div className="flex cursor-default gap-[7px]">
          <span className="text-zinc-200" style={{ fontSize: 11, width: 38, lineHeight: 1, margin: 'auto 0' }}>
            {name}
          </span>
          {swatches.map(({ shade, hex }) => (
            <div
              key={shade}
              className="group h-6 w-7 text-center transition-transform hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={() => {
                window.close();
                browser.runtime.sendMessage({ color: hex, shade });
              }}
            >
              <span
                className={`text-[9px] opacity-0 group-hover:opacity-100 ${shade.startsWith('A') ? 'text-black' : Number(shade) < 600 ? 'text-black' : 'text-zinc-200'}`}
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

export default MaterialColors;
