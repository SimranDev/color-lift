import eyeDropperSrc from '@/assets/eye-dropper.svg';
import { hexToRgb } from '@/utils';
import { useColorTileHandler } from '@/hooks/useColorTileHandler';

type EyeDropperProps = {
  setPickingColor: React.Dispatch<React.SetStateAction<boolean>>;
};

// The EyeDropper API is Chromium-only. Firefox has no implementation and no
// committed plan for one, so the tile renders disabled there instead of
// failing after the click. Deliberate — don't "fix" this by adding a fallback.
const IS_SUPPORTED = 'EyeDropper' in window;

const UNSUPPORTED_HINT =
  "Colour picking needs the EyeDropper API, which Firefox doesn't support. Try Firefox's built-in eyedropper: Menu → More Tools → Eyedropper";

const EyeDropper = ({ setPickingColor }: EyeDropperProps) => {
  const createTileHandler = useColorTileHandler();

  const handleColorPick = async () => {
    const eyeDropper = new (window as any).EyeDropper();

    try {
      setPickingColor(true);
      const { sRGBHex } = await eyeDropper.open();
      await createTileHandler({ hex: sRGBHex, rgb: hexToRgb(sRGBHex) })();
    } catch (error) {
      // Dismissing the picker with Escape rejects with AbortError. That is a
      // cancel, not a failure, so drop back to the palette instead of closing.
      if ((error as DOMException)?.name !== 'AbortError') {
        console.error('Error using EyeDropper:', error);
      }
    } finally {
      // In the popup this runs against a window that is already closing, which
      // is harmless. The side panel stays open, so it genuinely needs the
      // picking state cleared before the next pick.
      setPickingColor(false);
    }
  };

  if (!IS_SUPPORTED) {
    return (
      <div
        title={UNSUPPORTED_HINT}
        className="grid h-12 w-12 cursor-not-allowed place-items-center rounded-[4px] bg-gradient-to-tr from-slate-900 to-slate-600 opacity-40 @max-xl:h-9 @max-xl:w-9"
      >
        <img src={eyeDropperSrc} alt="Color Picker (unavailable in this browser)" className="h-5 @max-xl:h-4" />
      </div>
    );
  }

  return (
    <div
      onClick={handleColorPick}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-[4px] bg-gradient-to-tr from-slate-900 to-slate-600 hover:from-lime-900 @max-xl:h-9 @max-xl:w-9"
    >
      <img src={eyeDropperSrc} alt="Color Picker" className="h-5 fill-red-500 text-red-500 @max-xl:h-4" />
    </div>
  );
};

export default EyeDropper;
