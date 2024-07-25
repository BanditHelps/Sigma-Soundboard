import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import MainWindow from './components/MainWindow';
import Settings from './components/Settings';
import { Sound, Theme } from './types';
import './index.css';

const AppContainer = styled.div`
  display: flex;
  heightL 100vh;
`;


function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <AppContainer>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        openSettings={openSettings}
      />
      <MainWindow isLocked={isLocked}/>
      {isSettingsOpen && <Settings onClose={closeSettings} />}
    </AppContainer>
  );
}

export default App;