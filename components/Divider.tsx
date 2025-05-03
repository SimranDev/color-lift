type DividerProps = {
  className?: string;
};

const Divider = ({ className = '' }: DividerProps) => {
  return <span className={`h-[1px] w-full bg-neutral-800 ${className}`} />;
};

export default Divider;
