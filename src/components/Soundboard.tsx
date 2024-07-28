// src/components/SoundBoard.tsx
import React from 'react';
import { Sound, Theme } from '../types';

interface SoundBoardProps {
  sounds: Sound[];
  theme: Theme;
}

const SoundBoard: React.FC<SoundBoardProps> = ({ sounds, theme }) => {
  const playSound = (id: string) => {
    // Implement sound playing logic here
    console.log(`Playing sound with id: ${id}`);
  };

  return (
    <div className="sound-board">
      {sounds.map((sound) => (
        <button
          key={sound.id}
          onClick={() => playSound(sound.id)}
          style={{ backgroundColor: theme.buttonColor, color: theme.textColor }}
        >
          {sound.name}
        </button>
      ))}
    </div>
  );
};

export default SoundBoard;