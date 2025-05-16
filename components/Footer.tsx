import GitHubLogo from '@/assets/github.png';
import WebLogo from '@/assets/web.png';

type FooterProps = {};

const Footer = ({}: FooterProps) => {
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
    </div>
  );
};

export default Footer;
