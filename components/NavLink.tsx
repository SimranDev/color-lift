type NavLinkProps = {
  label: string;
  isActive: boolean;
  onClick: VoidFunction;
};

const NavLink = ({ label, isActive, onClick }: NavLinkProps) => {
  const classes = isActive
    ? 'text-lime-300 hover:bg-transparent hover:text-lime-300'
    : 'text-zinc-400 hover:bg-neutral-700 hover:text-zinc-200';
  return (
    <div className={`flex cursor-pointer items-center gap-2 pr-3 ${classes} group justify-end`} onClick={onClick}>
      <div
        className={`mr-auto ml-2 h-1 w-1 rounded-[2px] px-1 ${isActive ? 'bg-lime-800' : 'group-hover:bg-zinc-800'}`}
      />
      <span className="h-6 pt-[1px] font-sans text-sm tracking-wider">{label}</span>
    </div>
  );
};

export default NavLink;
