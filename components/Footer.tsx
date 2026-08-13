import GitHubLogo from '@/assets/github.png';
import WebLogo from '@/assets/web.png';

type FooterProps = {};

const Footer = ({}: FooterProps) => {
  const [windowId, setWindowId] = useState<number>();
  const inSidePanel = isSidePanel();

  useEffect(() => {
    if (inSidePanel) return;
    // sidePanel.open() has to be called inside the click's user gesture, so the
    // window id is fetched up front instead of being awaited in the handler.
    browser.windows.getCurrent().then((current) => setWindowId(current.id));
  }, [inSidePanel]);

  const openSidePanel = () => {
    // Firefox has no sidePanel API. It exposes the same drawer as sidebarAction,
    // which WXT wires to this entrypoint through manifest.sidebar_action.
    const { sidebarAction } = browser as unknown as { sidebarAction?: { open(): Promise<void> } };

    if (sidebarAction) sidebarAction.open().catch(() => {});
    else if (windowId != null) browser.sidePanel.open({ windowId }).catch(() => {});
    else return;

    // Deliberately not awaited: opening the panel moves focus off the popup,
    // which closes it, and the pending promise would never settle.
    window.close();
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <img
        src={GitHubLogo}
        className="h-[21px] cursor-pointer"
        alt="GitHub"
        title="GitHub"
        onClick={() => window.open('https://github.com/SimranDev/color-lift', '_blank')}
      />
      <img
        src={WebLogo}
        className="mt-[1px] h-6 cursor-pointer"
        alt="ColorLift"
        title="ColorLift"
        onClick={() => window.open('https://lift.codesim.dev', '_blank')}
      />

      {!inSidePanel && (
        <button
          type="button"
          title="Open in side panel — stays open while you work"
          aria-label="Open in side panel"
          onClick={openSidePanel}
          className="ml-auto cursor-pointer text-zinc-400 hover:text-lime-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="15" y1="4" x2="15" y2="20" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Footer;
