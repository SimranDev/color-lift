import eyeDropperSrc from '@/assets/eye-dropper.svg';
import { hexToRgb } from '@/utils';

type EyeDropperProps = {
  setPickingColor: React.Dispatch<React.SetStateAction<boolean>>;
};

const EyeDropper = ({ setPickingColor }: EyeDropperProps) => {
  const { setRecent, activeFormat } = useStore();

  const handleColorPick = async () => {
    if ('EyeDropper' in window) {
      const eyeDropper = new (window as any).EyeDropper();
      try {
        setPickingColor(true);
        const result = await eyeDropper.open();
        const rgb = hexToRgb(result.sRGBHex);
        const color = activeFormat === 'hex' ? result.sRGBHex : rgb;
        setRecent({ hex: result.sRGBHex, rgb });
        await navigator.clipboard.writeText(color);
        await browser.runtime.sendMessage({ color });
      } catch (error) {
        setPickingColor(false);
        console.error('Error using EyeDropper:', error);
      } finally {
        setPickingColor(false);
        window.close();
      }
    } else {
      alert('Your browser does not support the EyeDropper API.');
    }
  };

  return (
    <div
      onClick={handleColorPick}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-[4px] bg-gradient-to-tr from-slate-900 to-slate-600 hover:from-lime-900"
    >
      <img src={eyeDropperSrc} alt="Color Picker" className="h-5 fill-red-500 text-red-500" />
    </div>
  );
};

export default EyeDropper;
