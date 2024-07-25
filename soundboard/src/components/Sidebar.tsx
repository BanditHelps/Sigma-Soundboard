import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
    width: ${props => props.isCollapsed ? '50px' : '200px'};
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
    return (
        <SidebarContainer isCollapsed={isCollapsed}>
            <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? '>' : '<'}
            </ToggleButton>

            {/* Add more sidebar stuff */}

            <ButtonContainer>
                <IconButton onClick={() => setIsLocked(!isLocked)}>
                    {isLocked ? 'Unlock' : 'Lock'}
                </IconButton>
                <IconButton onClick={openSettings}>
                    ⚙️
                </IconButton>
            </ButtonContainer>

        </SidebarContainer>
    );
};

export default Sidebar;
