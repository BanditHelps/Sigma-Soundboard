use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use rodio::{OutputStream, Decoder, Sink};
use std::fs::File;
use std::io::BufReader;

#[derive(Serialize, Deserialize, Clone)]
pub struct Sound {
    id: String,
    name: String,
    path: String,
}

lazy_static::lazy_static! {
    static ref SOUNDS: Mutex<Vec<Sound>> = Mutex::new(Vec::new());
}

#[tauri::command]
pub fn load_sounds() -> Vec<Sound> {
    SOUNDS.lock().unwrap().clone()
}

#[tauri::command]
pub fn add_sound(name: String, path: String) -> Result<Sound, String> {
    let id = uuid::Uuid::new_v4().to_string();
    let sound = Sound { id, name, path };
    SOUNDS.lock().unwrap().push(sound.clone());
    Ok(sound)
}

#[tauri::command]
pub fn play_sound(id: String) -> Result<(), String> {
    let sounds = SOUNDS.lock().unwrap();
    let sound = sounds.iter().find(|s| s.id == id).ok_or("Sound not found")?;

    let (_stream, stream_handle) = OutputStream::try_default().map_err(|e| e.to_string())?;
    let file = BufReader::new(File::open(&sound.path).map_err(|e| e.to_string())?);
    let source = Decoder::new(file).map_err(|e| e.to_string())?;
    let sink = Sink::try_new(&stream_handle).map_err(|e| e.to_string())?;

    sink.append(source);
    sink.sleep_until_end();

    Ok(())
}