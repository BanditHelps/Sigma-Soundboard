// src/components/AddSoundForm.tsx
import React, { useState } from 'react';
import { Sound } from '../types';

interface AddSoundFormProps {
  onAddSound: (sound: Sound) => void;
}

const AddSoundForm: React.FC<AddSoundFormProps> = ({ onAddSound }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && file) {
      // Call backend to add sound
      // For now, we'll just create a dummy sound object
      const newSound: Sound = {
        id: Date.now().toString(),
        name: name,
        path: URL.createObjectURL(file),
      };
      onAddSound(newSound);
      setName('');
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sound name"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept="audio/*"
      />
      <button type="submit">Add Sound</button>
    </form>
  );
};

export default AddSoundForm;