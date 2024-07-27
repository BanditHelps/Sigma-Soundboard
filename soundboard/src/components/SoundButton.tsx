import React, { useState } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { Sound } from '../types';
import { useSounds } from '../contexts/SoundContext';
import EditSoundModal from './EditSoundModal';

const Button = styled.button<{ $color: string }>`
  width: 150px;
  height: 80px;
  background-color: ${props => props.$color};
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
  const { playSound, updateSoundPosition, updateSound, deleteSound } = useSounds();
  const [isEditing, setIsEditing] = useState(false);

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
            onClick={() => isLocked ? playSound(sound.path) : null}
            onDoubleClick={handleDoubleClick}
        >
            {sound.name}
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