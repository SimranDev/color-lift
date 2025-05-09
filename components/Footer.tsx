import GitHubLogo from '@/assets/github.png';

type FooterProps = {};

const Footer = ({}: FooterProps) => {
  return (
    <div className="px-3 py-2">
      <img
        src={GitHubLogo}
        className="h-6 cursor-pointer"
        alt="GitHub"
        title="GitHub"
        onClick={() => window.open('https://github.com/SimranDev/color-lift', '_blank')}
      />
    </div>
  );
};

export default Footer;
