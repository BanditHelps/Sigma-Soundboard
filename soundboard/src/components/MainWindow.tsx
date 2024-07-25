import React, { useState } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const MainWindowContainer = styled.div`
    flex-grow: 1;
    padding: 20px;
    position: relative;
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
`;

interface Sound {
    id: string;
    name: string;
}

interface MainWindowProps {
    isLocked: boolean;
}

const MainWindow: React.FC<MainWindowProps> = ({ isLocked }) => {
    const [sounds, setSounds] = useState<Sound[]>([
        { id: "1", name: "Sound 1" },
        { id: "2", name: "Sound 2" },
        { id: "3", name: "Sound 3" },
    ]);

    return (
        <MainWindowContainer>
            {sounds.map((sound) => (
                <Draggable key={sound.id} disabled={isLocked}>
                    <DraggableButton>{sound.name}</DraggableButton>
                </Draggable>
            ))}
        </MainWindowContainer>
    );
};

export default MainWindow;