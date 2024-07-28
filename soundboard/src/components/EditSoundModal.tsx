import React, { useState } from 'react';
import styled from 'styled-components';
import { Sound } from '../types';
import { open } from '@tauri-apps/api/dialog';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin-right: 10px;
`;

interface EditSoundModalProps {
  sound: Sound;
  onSave: (updatedSound: Sound) => void;
  onDelete: () => void;
  onClose: () => void;
}

const EditSoundModal: React.FC<EditSoundModalProps> = ({ sound, onSave, onDelete, onClose }) => {
  const [name, setName] = useState(sound.name);
  const [color, setColor] = useState(sound.color);
  const [path, setPath] = useState(sound.path);
  const [type, setType] = useState(sound.sound_type);

  const handleSave = () => {
    onSave({ ...sound, name, color, path, sound_type: type });
    onClose();
  };

  const handleChooseFile = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }]
    });
    if (selected && !Array.isArray(selected)) {
      setPath(selected);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Edit Sound Button</h2>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Button Name"
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <Input
          type="text"
          value={path}
          readOnly
          placeholder="Sound File Path"
        />
        <select value={type} onChange={(e) => setType(e.target.value as 'Effect' | 'Music')}>
          <option value="Effect">Sound Effect</option>
          <option value="Music">Music</option>
        </select>
        <Button onClick={handleChooseFile}>Choose File</Button>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onDelete}>Delete</Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditSoundModal;