import React from 'react';
import styled from 'styled-components';
import { useSounds } from '../contexts/SoundContext';

interface SidebarContainerProps {
    $isCollapsed: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
    width: ${props => props.$isCollapsed ? '50px' : '200px'};
    height: 100%;
    background-color: #74807d;
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
`;

const ToggleButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #dd;
    border: none;
    cursor: pointer;
`;

const ButtonContainer = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: column;
`;

const IconButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #ddd;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
`;

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    isLocked: boolean;
    setIsLocked: (isLocked: boolean) => void;
    openSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isCollapsed, 
    setIsCollapsed,
    isLocked,
    setIsLocked,
    openSettings
 }) => {
    const { saveSounds, loadSounds } = useSounds();

    const handleSave = async () => {
        try {
            await saveSounds();
            alert('Workspace saved successfully!');
        } catch (error) {
            console.error('Failed to save workspace:', error);
            alert('Failed to save workspace. Please try again.');
        }
    };

    const handleLoad = async () => {
        try {
            await loadSounds();
            alert('Workspace loaded successfully!');
        } catch (error) {
            console.error('Failed to load workspace:', error);
            alert('Failed to load workspace. Please try again.');
        }
    }

    return (
        <SidebarContainer $isCollapsed={isCollapsed}>
            <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? '>' : '<'}
            </ToggleButton>

            {/* Add more sidebar stuff */}

            <ButtonContainer>
                <IconButton onClick={handleSave}>
                    💾 Save
                </IconButton>
                <IconButton onClick={handleLoad}>
                    📂 Load
                </IconButton>
                <IconButton onClick={() => setIsLocked(!isLocked)}>
                    {isLocked ? 'Locked ❌' : 'Unlocked ✅'}
                </IconButton>
                <IconButton onClick={openSettings}>
                    ⚙️ Settings
                </IconButton>
            </ButtonContainer>

        </SidebarContainer>
    );
};

export default Sidebar;
