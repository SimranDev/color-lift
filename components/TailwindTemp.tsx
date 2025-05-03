import { TAILWIND } from '@/utils/seed';

type TailwindTempProps = {
  gap: string;
};

const TailwindTemp = ({ gap }: TailwindTempProps) => {
  return (
    <div className={`grid p-[7px] ${gap}`}>
      {TAILWIND.map(({ swatches, name }) => (
        <div className={`flex cursor-default ${gap}`}>
          <span style={{ fontSize: 11, width: 36 }}>{name}</span>
          {swatches.map(({ shade, hex }) => (
            <div
              key={shade}
              className="group h-5 w-[37.6px] text-center transition-transform hover:scale-150"
              style={{ backgroundColor: hex }}
              onClick={() => {
                window.close();
                browser.runtime.sendMessage({ color: hex, shade });
              }}
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

export default TailwindTemp;
