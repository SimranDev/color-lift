const FormatToggle = () => {
  const { activeFormat, setActiveFormat } = useStore();

  return (
    <div className="px-2">
      <div className="flex h-5 w-full cursor-pointer rounded-[2px] bg-slate-500 text-center font-mono leading-5 font-bold tracking-wider">
        <span
          role="button"
          className={`flex-1 rounded-l-[2px] pt-[0.5px] ${activeFormat === 'hex' ? 'text-lime-300' : 'bg-slate-600 text-slate-400'}`}
          onClick={() => setActiveFormat('hex')}
        >
          HEX
        </span>
        <span
          role="button"
          className={`flex-1 rounded-r-[2px] pt-[0.5px] ${activeFormat === 'rgb' ? 'text-lime-300' : 'bg-slate-600 text-slate-400'}`}
          onClick={() => setActiveFormat('rgb')}
        >
          RGB
        </span>
      </div>
    </div>
  );
};

export default FormatToggle;
