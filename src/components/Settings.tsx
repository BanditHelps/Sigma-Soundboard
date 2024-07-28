import React from "react";
import styled from "styled-components";

const SettingsOverlay = styled.div`
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

const SettingsWindow = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 5px;
`;

const CloseButton = styled.button`
    float: right;
`;


interface SettingsProps {
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    return (
        <SettingsOverlay>
            <SettingsWindow>
                <h2>Settings</h2>
                <CloseButton onClick={onClose}>Close</CloseButton>
                <p>Settings will be here....</p>
            </SettingsWindow>
        </SettingsOverlay>
    );
};

export default Settings;