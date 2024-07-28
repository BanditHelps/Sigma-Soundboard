import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import MainWindow from './components/MainWindow';
import Settings from './components/Settings';
import KeybindListener from './components/KeyboardListener';
import { SoundProvider } from './contexts/SoundContext';
import { appWindow } from '@tauri-apps/api/window';
import { emit } from '@tauri-apps/api/event';
import './index.css';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  display: flex;
  overflow: hidden;
`;


function AppContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  useEffect(() => {
    const unlistenFileDrop = appWindow.onFileDropEvent(event => {
      if (event.payload.type === 'hover') {
        console.log('File is hovering');
        emit('file-hover');
      } else if (event.payload.type === 'drop') {
        console.log('File Dropped:', event.payload.paths);
        emit('file-drop', event.payload.paths);
      }
    });

    return () => {
      unlistenFileDrop.then(unlisten => unlisten());
    };
  }, []);

  return (
    <AppContainer>
      <KeybindListener />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        openSettings={openSettings}
      />
      <MainContainer>
        <MainWindow isLocked={isLocked}/>
      </MainContainer>
      {isSettingsOpen && <Settings onClose={closeSettings} />}
    </AppContainer>
  );
}

function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
}

export default App;