import { Dispatch, SetStateAction } from 'react';

type FormatToggleProps = {
  colorFormat: 'hex' | 'rgb';
  setColorFormat: Dispatch<SetStateAction<'hex' | 'rgb'>>;
};

const FormatToggle = ({ colorFormat, setColorFormat }: FormatToggleProps) => {
  return (
    <div className="px-2">
      <div className="flex h-5 w-full cursor-pointer rounded-[2px] bg-zinc-500 text-center font-mono leading-5 font-bold tracking-wider">
        <span
          role="button"
          className={`flex-1 rounded-l-[2px] pt-[0.5px] ${colorFormat === 'hex' ? 'text-lime-300' : 'bg-zinc-600 text-zinc-400'}`}
          onClick={() => setColorFormat('hex')}
        >
          HEX
        </span>
        <span
          role="button"
          className={`flex-1 rounded-r-[2px] pt-[0.5px] ${colorFormat === 'rgb' ? 'text-lime-300' : 'bg-zinc-600 text-zinc-400'}`}
          onClick={() => setColorFormat('rgb')}
        >
          RGB
        </span>
      </div>
    </div>
  );
};

export default FormatToggle;
