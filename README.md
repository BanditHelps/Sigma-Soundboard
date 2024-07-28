# Sigma Soundboard

## Overview

The Sigma Soundboard is a powerful and customizable audio playback application designed for streamers, podcasters, and Discord users. Built with Rust and React, it offers a user-friendly interface for managing and playing sound effects and background music with ease.

## Features

- **Drag-and-Drop Interface**: Easily add new sounds by dragging audio files into the application.
- **Customizable Sound Buttons**: Edit button names, colors, and sound types (Effect or Music).
- **Lock/Unlock Mode**: Prevent accidental changes to your layout during use.
- **Save/Load Functionality**: Save your soundboard setup and load it later.
- **Responsive Design**: Collapsible sidebar for maximizing screen space.
- **Visual Feedback**: Animated buttons indicate when sounds are playing.
- **Multi-Platform**: Works on Windows, macOS, and Linux. (Haven't actually tested on Mac or Linux)

## Installation

1. Ensure you have [Rust](https://www.rust-lang.org/tools/install) and [Node.js](https://nodejs.org/) installed on your system.

2. Clone the repository:
```
git clone https://github.com/yourusername/sigma-soundboard.git
cd sigma-soundboard
```

3. Install frontend dependencies:
```
npm install
```

4. Install Rust dependencies:
```
cargo build
```

## Running the Application
```
npm run tauri dev
```

## Usage
1. **Adding Sounds**: Drag and drop audio files (.mp3 or .wav) onto the main window.

2. **Playing Sounds**: Click on a sound button to play it. Effects play once, while Music loops.

3. **Editing Sounds**: Double-click a sound button when unlocked to edit its properties.

4. **Arranging Sounds**: Drag sound buttons to rearrange them when unlocked.

5. **Locking the Layout**: Use the lock/unlock button in the sidebar to prevent accidental changes.

6. **Saving/Loading**: Use the Save and Load buttons in the sidebar to preserve and recall your setups.

## Building for production
To create a production build of the Sigma Soundboard:
```
npm run tauri build
```

## Contributing
Contributions are welcome! Please feel free to submit pull requests or create issues.

## TODO
- [ ] Virtual Audio Cabling
- [ ] Better customizations
- [ ] Keybind / Controller support
- [ ] Different Tabs
- [ ] Finish Themes