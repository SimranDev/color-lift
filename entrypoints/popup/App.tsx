import { useState } from 'react';
import Select from '@/components/Select';
import { Palette } from '@/types/enums';
import TailwindTemp from '@/components/TailwindTemp';
import { paletteOptions } from '@/utils';
import NavLink from '@/components/NavLink';
import Logo from '@/components/Logo';
import PickingColorPopup from '@/components/PickingColorPopup';
import FormatToggle from '@/components/FormatToggle';
import Divider from '@/components/Divider';
import Footer from '@/components/Footer';

function App() {
  const [palette, setPalette] = useState<Palette>(Palette.TAILWIND);
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb'>('hex');
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [pickingColor, setPickingColor] = useState(false);
  const gap = 'gap-[5px]';

  const handleColorPick = async () => {
    console.log('Picking color...');
    if ('EyeDropper' in window) {
      const eyeDropper = new (window as any).EyeDropper();
      try {
        setPickingColor(true);
        const result = await eyeDropper.open();
        console.log(result);
        setPickedColor(result.sRGBHex);
        await browser.runtime.sendMessage({ type: 'COLOR_PICKED', message: result.sRGBHex });
      } catch (error) {
        setPickingColor(false);
        console.error('Error using EyeDropper:', error);
      } finally {
        setPickingColor(false);
      }
    } else {
      alert('Your browser does not support the EyeDropper API.');
    }
  };

  return (
    <main className="flex h-full">
      {pickingColor ? (
        <PickingColorPopup />
      ) : (
        <div style={{ display: 'flex', width: '668px', height: '600px' }}>
          <div className="flex max-w-32 flex-col gap-2 border-r border-neutral-800 bg-gradient-to-r from-slate-800 to-stone-950 pt-1">
            <Logo />
            <FormatToggle colorFormat={colorFormat} setColorFormat={setColorFormat} />
            <Divider />
            <div className="flex flex-col gap-1">
              {paletteOptions.map((option) => (
                <NavLink
                  key={option.value}
                  label={option.label}
                  isActive={palette === option.value}
                  onClick={() => setPalette(option.value as Palette)}
                />
              ))}
            </div>
            <Divider />
            <button onClick={handleColorPick}>Color Picker</button>
            <Divider className="mt-auto" />
            <div className="grid gap-1 px-2 pb-1">
              <label className="font-sans text-[11px] tracking-wider text-neutral-500">HISTORY</label>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className={`h-4 w-[39px] cursor-pointer bg-blue-400 text-center text-[8px] transition-transform duration-200 hover:scale-150`}
                  >
                    {pickedColor}
                  </div>
                ))}
              </div>
            </div>
            <Divider />
            <Footer />
          </div>
          {palette === Palette.TAILWIND && <TailwindTemp gap="gap-[7px]" />}
          {palette === Palette.RADIX_DARK && (
            <div className={`grid p-[6px] ${gap}`}>
              {Array.from({ length: 31 }, (_, index) => (
                <div className={`flex ${gap}`}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <div className="group relative h-[14.2px] w-[38.1px] cursor-pointer bg-blue-400 text-center text-[8px] transition-transform duration-200 hover:scale-150">
                      {index + 1}-{i + 1}
                      <div className="absolute top-0 -left-12 z-10 hidden h-4 w-10 bg-white shadow-2xl group-hover:block">
                        Label
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
