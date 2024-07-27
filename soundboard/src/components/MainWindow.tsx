import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { Sound } from '../types';

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

const DraggableButton = styled.button`
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

interface MainWindowProps {
    isLocked: boolean;
}

const MainWindow: React.FC<MainWindowProps> = ({ isLocked }) => {
    const [sounds, setSounds] = useState<Sound[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("MainWindow mounted");

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
          fileHoverUnlisten.then(unlisten => unlisten());
          fileDropUnlisten.then(unlisten => unlisten());
        }
    }, []);

    const handleFileDrop = async (paths: string[]) => {
      const audioFile = paths.find(filePath => 
        filePath.toLowerCase().endsWith('.mp3') || filePath.toLowerCase().endsWith('wav')
      );

      if (audioFile && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;

        const fileName = audioFile.split(/[\\/]/).pop() || 'Unknown';

        try {
          const newSound: Sound = await invoke('add_sound', {
            name: fileName,
            path: audioFile,
            x,
            y,
          });

          console.log("New Sound added: ", newSound);
          setSounds(prevSounds => [...prevSounds, newSound]);
        } catch(error) {
          console.error('Failed to add sound: ', error);
          alert(`Failed to add sound: ${error}`);
        }
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
          {sounds.map((sound: Sound) => (
            <Draggable
              key={sound.id}
              bounds="parent"
              disabled={isLocked}
              defaultPosition={{ x: sound.x, y: sound.y }}
              onStop={(e, data) => {
                invoke('update_sound_position', {
                  id: sound.id,
                  x: data.x,
                  y: data.y,
                });
              }}
            >
              <DraggableButton>{sound.name}</DraggableButton>
            </Draggable>
          ))}
        </MainWindowContainer>
      );
};

export default MainWindow;