import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { listen } from '@tauri-apps/api/event';
import { useSounds } from "../contexts/SoundContext";
import SoundButton from "./SoundButton";
import { Sound } from "../types";

const MainWindowContainer = styled.div`
    flex-grow: 1;
    padding: 20px;
    position: relative;
    overflow: hidden;
    border: 2px dashed #ccc;
    display: flex;
    flex-direction: column;
`;

const DropZone = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #666;
    border: 2px dashed #ccc;
    margin: 20px;
    padding: 20px;
`;

interface MainWindowProps {
    isLocked: boolean;
}



const MainWindow: React.FC<MainWindowProps> = ({ isLocked }) => {
    const { sounds, addSound } = useSounds();
    const [isDragging, setIsDragging] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x:0, y:0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updateMousePosition = (ev: MouseEvent) => {
        setMousePosition({ x:ev.clientX, y:ev.clientY});
        // console.log(`${ev.clientX}, ${ev.clientY}`);
      };

      window.addEventListener('mousemove', updateMousePosition);

      const fileHoverUnlisten = listen('file-hover', () => {
        console.log("file Hover event was received in React");
        setIsDragging(true);
      });

      const fileDropUnlisten = listen('file-drop', (event) => {
        console.log("File Drop event was received in React", event);
        setIsDragging(false);
        handleFileDrop(event.payload as string[]);
      });

      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
        fileHoverUnlisten.then(unlisten => unlisten());
        fileDropUnlisten.then(unlisten => unlisten());
      };
    }, []);

    const findRandomOpenSpace = (containerRect: DOMRect, buttonWidth: number, buttonHeight: number): { x: number, y: number } => {
      const maxAttempts = 50;
      const margin = 10; // pixels of margin from the edges
    
      for (let i = 0; i < maxAttempts; i++) {
        const x = Math.random() * (containerRect.width - buttonWidth - 2 * margin) + margin;
        const y = Math.random() * (containerRect.height - buttonHeight - 2 * margin) + margin;
    
        // Check if this space overlaps with existing buttons
        const overlaps = sounds.some(sound => {
          const soundX = (sound.x / 100) * containerRect.width;
          const soundY = (sound.y / 100) * containerRect.height;
          return (
            x < soundX + buttonWidth &&
            x + buttonWidth > soundX &&
            y < soundY + buttonHeight &&
            y + buttonHeight > soundY
          );
        });
    
        if (!overlaps) {
          return { x, y };
        }
      }
    
      // If we couldn't find an open space, just return a random position
      return {
        x: Math.random() * (containerRect.width - buttonWidth - 2 * margin) + margin,
        y: Math.random() * (containerRect.height - buttonHeight - 2 * margin) + margin
      };
    };

    const handleFileDrop = async (paths: string[]) => {
      console.log("Is this even running?");
      const audioFile = paths.find(filePath => 
        filePath.toLowerCase().endsWith('.mp3') || filePath.toLowerCase().endsWith('wav')
      );

      if (audioFile && containerRef.current) {
        const fileName = audioFile.split(/[\\/]/).pop() || 'Unknown';

        // const rect = containerRef.current.getBoundingClientRect();
        // const x = (position.x - rect.left) / rect.width * 100;
        // const y = (position.y - rect.top) / rect.height * 100;    

        const rect = containerRef.current.getBoundingClientRect();
    
        const buttonWidth = 150; // Adjust these values based on your actual button size
        const buttonHeight = 80;

        const { x, y } = findRandomOpenSpace(rect, buttonWidth, buttonHeight);
        
        
        console.log("Drop Position: ", {x, y})

        const newSound: Sound = {
          id: Date.now().toString(),
          name: fileName,
          path: audioFile,
          x: x,
          y: y,
          color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
          sound_type: 'Effect', // Default to 'Effect', user can change later
          isPlaying: false
        };
  
        addSound(newSound);

      } else {
        console.log("No vaild audio file found in the drop");
        alert("Please drop a .mp3 or .wav");
      }
    };

    return (
      <MainWindowContainer
        ref={containerRef}
        style={{ 
          borderColor: isDragging ? '#007bff' : '#ccc',
          backgroundColor: isDragging ? 'rgba(0, 123, 255, 0.1)' : 'transparent'
        }}
      >
        <DropZone>
          {isDragging ? 'Drop the file here' : 'Drag and drop audio files here'}
        </DropZone>
        {sounds.map((sound) => (
          <SoundButton key={sound.id} sound={sound} isLocked={isLocked} />
        ))}
      </MainWindowContainer>
    );
};

export default MainWindow;