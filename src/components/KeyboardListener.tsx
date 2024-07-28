import React, { useEffect } from 'react';
import { useSounds } from '../contexts/SoundContext';

const KeybindListener: React.FC = () => {
  const { sounds, playSound } = useSounds();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const baseCombo = event.altKey && event.key === '`';
      if (baseCombo) {
        const listener = (e: KeyboardEvent) => {
          const fullKeybind = `Alt+\`+${e.key}`;
          const sound = sounds.find(s => s.keybind === fullKeybind);
          if (sound) {
            playSound(sound.id);
          }
          document.removeEventListener('keydown', listener);
        };
        document.addEventListener('keydown', listener, { once: true });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sounds, playSound]);

  return null;
};

export default KeybindListener;