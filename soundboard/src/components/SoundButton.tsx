import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Draggable from 'react-draggable';
import { Sound } from '../types';
import { useSounds } from '../contexts/SoundContext';
import EditSoundModal from './EditSoundModal';


const rainbowAnimation = keyframes`
  0% { border-color: red; }
  14% { border-color: orange; }
  28% { border-color: yellow; }
  42% { border-color: green; }
  56% { border-color: blue; }
  70% { border-color: indigo; }
  84% { border-color: violet; }
  100% { border-color: red; }
`;

const Button = styled.button<{ $color: string; $isPlaying: boolean; $sound_type: 'Effect' | 'Music' }>`
  width: 150px;
  height: 80px;
  background-color: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$isPlaying ? 'default' : 'pointer'};
  user-select: none;
  position: absolute;
  font-size: 14px;
  text-align: center;
  word-wrap: break-word;
  padding: 5px;
  border: 4px solid transparent;
  animation: ${props => props.$isPlaying && props.$sound_type === 'Music' ? rainbowAnimation : 'none'} 2s linear infinite;
  box-shadow: ${props => props.$isPlaying && props.$sound_type === 'Effect' ? '0 0 10px 5px rgba(255, 255, 255, 0.5)' : 'none'};
`;


interface SoundButtonProps {
  sound: Sound;
  isLocked: boolean;
}

const SoundButton: React.FC<SoundButtonProps> = ({ sound, isLocked }) => {
  const { playSound, stopSound, updateSoundPosition, updateSound, deleteSound } = useSounds();
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    if (isLocked) {
        if (sound.isPlaying) {
            if (sound.sound_type === "Effect") {
                stopSound(sound.id);
                playSound(sound.id);
            } else {
                stopSound(sound.id);
            }
            
        } else {
            playSound(sound.id);
        }
        
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) {
        setIsEditing(true);
    }
  };


  return (
    <>
        <Draggable
            bounds="parent"
            disabled={isLocked}
            defaultPosition={{ x: sound.x, y: sound.y }}
            onStop={(e, data) => {
                updateSoundPosition(sound.id, data.x, data.y);
            }}
        >
        <Button
            $color={sound.color}
            $isPlaying={sound.isPlaying}
            $sound_type={sound.sound_type}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {sound.name}
            {sound.isPlaying && sound.sound_type === 'Music' && ' (Playing)'}
        </Button>
        </Draggable>
        {isEditing && (
            <EditSoundModal
                sound={sound}
                onSave={(updatedSound) => {
                    updateSound(updatedSound);
                    setIsEditing(false);
                }}
                onDelete={() => {
                    deleteSound(sound.id);
                    setIsEditing(false);
                }}
                onClose={() => setIsEditing(false)}
            />
        )}
    </>
  );
};

export default SoundButton;