// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use rodio::{OutputStream, Sink, Source};
use std::io::BufReader;
use std::fs::File;
use serde_json;
use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::lazy_static;
use std::sync::mpsc::{channel, Sender, Receiver};
use std::thread;
use native_dialog::{FileDialog, MessageType, MessageDialog};
use std::path::PathBuf;

// Define our audio commands
enum AudioCommand {
    PlayEffect(String, String), // id, path
    PlayMusic(String, String),  // id, path
    Stop(String),               // id
    StopAll,
}

lazy_static! {
    static ref AUDIO_SENDER: Mutex<Sender<AudioCommand>> = Mutex::new(audio_player_thread());
}

fn audio_player_thread() -> Sender<AudioCommand> {
    let (tx, rx): (Sender<AudioCommand>, Receiver<AudioCommand>) = channel();
    
    thread::spawn(move || {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let mut effects: HashMap<String, Sink> = HashMap::new();
        let mut music: Option<(String, Sink)> = None;

        for cmd in rx {
            match cmd {
                AudioCommand::PlayEffect(id, path) => {
                    if let Some(sink) = effects.get(&id) {
                        sink.stop();
                    }
                    let file = BufReader::new(File::open(path).unwrap());
                    let source = rodio::Decoder::new(file).unwrap();
                    let sink = Sink::try_new(&stream_handle).unwrap();
                    sink.append(source);
                    effects.insert(id, sink);
                }
                AudioCommand::PlayMusic(id, path) => {
                    if let Some((_, sink)) = &music {
                        sink.stop();
                    }
                    let file = BufReader::new(File::open(path).unwrap());
                    let source = rodio::Decoder::new(file).unwrap().repeat_infinite();
                    let sink = Sink::try_new(&stream_handle).unwrap();
                    sink.append(source);
                    music = Some((id, sink));
                }
                AudioCommand::Stop(id) => {
                    if let Some(sink) = effects.get(&id) {
                        sink.stop();
                        effects.remove(&id);
                    }
                    if let Some((music_id, sink)) = &music {
                        if *music_id == id {
                            sink.stop();
                            music = None;
                        }
                    }
                }
                AudioCommand::StopAll => {
                    for (_, sink) in effects.drain() {
                        sink.stop();
                    }
                    if let Some((_, sink)) = music.take() {
                        sink.stop();
                    }
                }
            }
            
            // Clean up finished effect sounds
            effects.retain(|_, sink| !sink.empty());
        }
    });

    tx
}

#[tauri::command]
fn play_sound(id: String, path: String, sound_type: SoundType) -> Result<String, String> {
    println!("Attempting to play sound: {} from path: {}", id, path);
    let sender = AUDIO_SENDER.lock().unwrap();
    let command = match sound_type {
        SoundType::Effect => AudioCommand::PlayEffect(id.clone(), path),
        SoundType::Music => AudioCommand::PlayMusic(id.clone(), path),
    };
    sender.send(command)
        .map_err(|e| format!("Failed to send play command: {}", e))?;
    Ok(format!("Sound {} started playing", id))
}

#[tauri::command]
fn stop_sound(id: String) -> Result<(), String> {
    println!("Attempting to stop sound: {}", id);
    let sender = AUDIO_SENDER.lock().unwrap();
    sender.send(AudioCommand::Stop(id))
        .map_err(|e| format!("Failed to send stop command: {}", e))?;
    Ok(())
}

#[tauri::command]
fn stop_all_sounds() -> Result<(), String> {
    let sender = AUDIO_SENDER.lock().unwrap();
    sender.send(AudioCommand::StopAll)
        .map_err(|e| format!("Failed to send stop all command: {}", e))?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Sound {
    pub id: String,
    pub name: String,
    pub path: String,
    pub x: f64,
    pub y: f64,
    pub color: String,
    pub sound_type: SoundType,
    pub is_playing: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum SoundType {
    Effect,
    Music,
}

#[tauri::command]
fn save_sounds(sounds: Vec<Sound>) -> Result<(), String> {
    let path = FileDialog::new()
        .set_location("~/Desktop")
        .add_filter("JSON File", &["json"])
        .set_filename("soundboard.json")
        .show_save_single_file()
        .map_err(|e| e.to_string())?;

    if let Some(path) = path {
        let json = serde_json::to_string_pretty(&sounds).map_err(|e| e.to_string())?;
        fs::write(&path, json).map_err(|e| e.to_string())?;
        MessageDialog::new()
            .set_type(MessageType::Info)
            .set_title("Save Successful")
            .set_text(&format!("Sounds saved to {:?}", path))
            .show_alert()
            .map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("Save cancelled".to_string())
    }
}

#[tauri::command]
fn get_sounds() -> Result<Vec<Sound>, String> {
    let path = FileDialog::new()
        .set_location("~/Desktop")
        .add_filter("JSON File", &["json"])
        .show_open_single_file()
        .map_err(|e| e.to_string())?;

    if let Some(path) = path {
        let json = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let sounds: Vec<Sound> = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        Ok(sounds)
    } else {
        Err("Load cancelled".to_string())
    }
}


#[tauri::command]
fn add_sound(name: String, path: String, x: f64, y: f64, color: String, sound_type: SoundType) -> Result<Sound, String> {
    let new_sound = Sound {
        id: Uuid::new_v4().to_string(),
        name,
        path,
        x,
        y,
        color,
        sound_type,
        is_playing: false,
    };

    Ok(new_sound)
}

#[tauri::command]
fn update_sound_position(id: String, x: f64, y: f64) -> Result<(), String> {
    //This will need to move to a data base or json file
    println!("Updated sound position: id={}, x={}, y={}", id, x, y);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app.path_resolver().app_data_dir().unwrap();
            let sounds_dir = app_dir.join("sounds");
            if !sounds_dir.exists() {
                fs::create_dir_all(sounds_dir).unwrap();
            }

            lazy_static::initialize(&AUDIO_SENDER);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_sounds, add_sound, update_sound_position, play_sound, stop_sound, save_sounds, stop_all_sounds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
