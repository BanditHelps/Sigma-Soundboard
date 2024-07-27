import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { Sound } from '../types';
import { useSounds } from '../contexts/SoundContext';

const Button = styled.button`
  width: 150px;
  height: 80px;
  background-color: #4a90e2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
  position: absolute;
  font-size: 14px;
  text-align: center;
  word-wrap: break-word;
  padding: 5px;
`;

interface SoundButtonProps {
  sound: Sound;
  isLocked: boolean;
}

const SoundButton: React.FC<SoundButtonProps> = ({ sound, isLocked }) => {
  const { playSound, updateSoundPosition } = useSounds();

  return (
    <Draggable
      bounds="parent"
      disabled={isLocked}
      defaultPosition={{ x: sound.x, y: sound.y }}
      onStop={(e, data) => {
        updateSoundPosition(sound.id, data.x, data.y);
      }}
    >
      <Button
        onClick={() => isLocked ? playSound(sound.path) : null}
      >
        {sound.name}
      </Button>
    </Draggable>
  );
};

export default SoundButton;