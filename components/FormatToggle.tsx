const FormatToggle = () => {
  const { activeFormat, setActiveFormat } = useStore();

  return (
    <div className="px-2 @max-xl:order-4 @max-xl:w-28 @max-xl:shrink-0 @max-xl:px-0">
      <div className="flex h-5 w-full cursor-pointer rounded-[2px] bg-slate-500 text-center font-mono text-[10px] leading-5 font-bold">
        {formatOptions.map(({ label, value }) => (
          <span
            key={value}
            role="button"
            className={`flex-1 first:rounded-l-[2px] last:rounded-r-[2px] ${
              activeFormat === value ? 'text-lime-300' : 'bg-slate-600 text-slate-400'
            }`}
            onClick={() => setActiveFormat(value)}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FormatToggle;
