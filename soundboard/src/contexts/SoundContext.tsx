import React, { createContext, useState, useContext, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Sound } from '../types';

interface SoundContextType {
  sounds: Sound[];
  addSound: (sound: Sound) => void;
  updateSoundPosition: (id: string, x: number, y: number) => void;
  playSound: (path: string) => void;
  saveSounds: () => void;
  loadSounds: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sounds, setSounds] = useState<Sound[]>([]);

  useEffect(() => {
    loadSounds();
  }, []);

  const addSound = async (sound: Sound) => {
    try {
      const newSound: Sound = await invoke('add_sound', {
        name: sound.name,
        path: sound.path,
        x: sound.x,
        y: sound.y,
      });
      setSounds(prevSounds => [...prevSounds, newSound]);
    } catch (error) {
      console.error('Failed to add sound: ', error);
      alert(`Failed to add sound: ${error}`);
    }
  };

  const updateSoundPosition = async (id: string, x: number, y: number) => {
    try {
      await invoke('update_sound_position', { id, x, y });
      setSounds(prevSounds =>
        prevSounds.map(sound =>
          sound.id === id ? { ...sound, x, y } : sound
        )
      );
    } catch (error) {
      console.error('Failed to update sound position: ', error);
    }
  };

  const playSound = async (path: string) => {
    try {
      await invoke('play_sound', { path });
    } catch (error) {
      console.error('Failed to play the sound: ', error);
      alert(`Failed to play the sound: ${error}`);
    }
  };

  const saveSounds = async () => {
    try {
      await invoke('save_sounds', { sounds });
    } catch (error) {
      console.error('Failed to save sounds: ', error);
      alert(`Failed to save sounds: ${error}`);
    }
  };

  const loadSounds = async () => {
    try {
      const loadedSounds: Sound[] = await invoke('get_sounds');
      setSounds(loadedSounds);
    } catch (error) {
      console.error('Failed to load sounds: ', error);
      alert(`Failed to load sounds: ${error}`);
    }
  };

  return (
    <SoundContext.Provider value={{ sounds, addSound, updateSoundPosition, playSound, saveSounds, loadSounds }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSounds must be used within a SoundProvider');
  }
  return context;
};