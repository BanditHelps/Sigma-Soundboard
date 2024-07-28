import React, { createContext, useState, useContext, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Sound } from '../types';

interface SoundContextType {
  sounds: Sound[];
  addSound: (sound: Sound) => void;
  updateSoundPosition: (id: string, x: number, y: number) => void;
  updateSound: (updatedSound: Sound) => void;
  deleteSound: (id: string) => void;
  playSound: (id: string) => void;
  stopSound: (id: string) => void;
  saveSounds: () => void;
  loadSounds: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sounds, setSounds] = useState<Sound[]>([]);

//   useEffect(() => {
//     loadSounds();
//   }, []);

  const addSound = async (sound: Sound) => {
    try {
      const newSound: Sound = await invoke('add_sound', {
        name: sound.name,
        path: sound.path,
        x: sound.x,
        y: sound.y,
        color: '#662266',
        soundType: "Effect",
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

  const playSound = async (id: string) => {
    const sound = sounds.find(s => s.id === id);
    if (!sound) return;
  
    try {
        const result = await invoke('play_sound', { 
          id, 
          path: sound.path, 
          soundType: sound.sound_type 
        });
        console.log(result);  // This will log the result from the Rust function
      } catch (error) {
        console.error('Failed to play the sound: ', error);
        alert(`Failed to play the sound: ${error}. Sound type: ${sound.sound_type}`);
      }
  
    setSounds(prevSounds =>
      prevSounds.map(s =>
        s.id === id
          ? { ...s, isPlaying: s.sound_type === 'Music' ? !s.isPlaying : true }
          : s.sound_type === 'Music' && s.isPlaying
          ? { ...s, isPlaying: false }
          : s
      )
    );
  };

  const stopSound = async (id: string) => {
    try {
      await invoke('stop_sound', { id });
      setSounds(prevSounds =>
        prevSounds.map(s =>
          s.id === id ? { ...s, isPlaying: false } : s
        )
      );
    } catch (error) {
      console.error('Failed to stop the sound: ', error);
      alert(`Failed to stop the sound: ${error}`);
    }
  };

  const saveSounds = async () => {
        try {
            await invoke('save_sounds', { sounds });
            console.log('Sounds saved successfully');
        } catch (error) {
            console.error('Failed to save sounds: ', error);
            if (error !== "Save cancelled") {
                throw error;
            }
        }
    };

    const loadSounds = async () => {
        try {
            const loadedSounds: Sound[] = await invoke('get_sounds');
            setSounds(loadedSounds);
            console.log('Sounds loaded successfully');
        } catch (error) {
            console.error('Failed to load sounds: ', error);
            if (error !== "Load cancelled") {
                throw error;
            }
        }
    };

  const updateSound = (updatedSound: Sound) => {
    setSounds(prevSounds =>
        prevSounds.map(sound =>
            sound.id === updatedSound.id ? updatedSound : sound
        )
    );
  };

  const deleteSound = (id: string) => {
    setSounds(prevSounds => prevSounds.filter(sound => sound.id !== id));
  };

  return (
    <SoundContext.Provider value={{ 
        sounds,
        addSound, 
        updateSoundPosition,
        updateSound,
        deleteSound, 
        playSound,
        stopSound, 
        saveSounds, 
        loadSounds 
    }}>
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