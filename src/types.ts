export interface Sound {
    id: string;
    name: string;
    path: string;
    x: number;
    y: number;
    color: string;
    sound_type: 'Effect' | 'Music';
    isPlaying: boolean;
    keybind: string | null;
}

export interface Theme {
    backgroundColor: string;
    buttonColor: string;
    textColor: string;
}