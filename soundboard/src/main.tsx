import React from 'react';
import ReactDOM from 'react-dom/client';
// import { invoke } from "@tauri-apps/api/tauri";
import App from './App';
import './index.css'

console.log("main.tsx is running");

// invoke('get_sounds')
//     .then((response) => console.log('get_sounds response:', response))
//     .catch((error) => console.error('get_sounds error: ', error));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

console.log("React app has been rendered");