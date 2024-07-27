// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::io::Read;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use rodio::{Decoder, OutputStream, Sink};
use std::io::BufReader;
use std::fs::File;
use serde_json;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Sound {
    id: String,
    name: String,
    path: String,
    x: f64,
    y: f64,
    color: String,
}

#[tauri::command]
fn save_sounds(sounds: Vec<Sound>) -> Result<(), String> {
    let app_dir = tauri::api::path::app_data_dir(&tauri::Config::default()).unwrap();
    let sounds_file = app_dir.join("sounds.json");
    let json = serde_json::to_string(&sounds).map_err(|e| e.to_string())?;
    fs::write(sounds_file, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_sounds() -> Result<Vec<Sound>, String> {
    let app_dir = tauri::api::path::app_data_dir(&tauri::Config::default()).unwrap();
    let sounds_file = app_dir.join("sounds.json");
    if sounds_file.exists() {
        let json = fs::read_to_string(sounds_file).map_err(|e| e.to_string())?;
        let sounds: Vec<Sound> = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        Ok(sounds)
    } else {
        Ok(Vec::new())
    }
}


#[tauri::command]
fn add_sound(app_handle: tauri::AppHandle, name: String, path: String, x:f64, y:f64, color: String) -> Result<Sound, String> {
    println!("Adding sound: {} at ({}, {})", name, x, y);
    let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let sounds_dir = app_dir.join("sounds");

    if !sounds_dir.exists() {
        fs::create_dir_all(&sounds_dir).map_err(|e| e.to_string())?;
    }

    let dest_path = sounds_dir.join(&name);

    let mut file = fs::File::open(&path).map_err(|e| e.to_string())?;
    let mut contents = Vec::new();
    file.read_to_end(&mut contents).map_err(|e| e.to_string())?;

    fs::write(&dest_path, &contents).map_err(|e| e.to_string())?;

    let new_sound = Sound {
        id: Uuid::new_v4().to_string(),
        name,
        path: dest_path.to_str().unwrap().to_string(),
        x,
        y,
        color,
    };

    println!("Sound added successfully: {:?}", new_sound);
    Ok(new_sound)
}

#[tauri::command]
fn update_sound_position(id: String, x: f64, y: f64) -> Result<(), String> {
    //This will need to move to a data base or json file
    println!("Updated sound position: id={}, x={}, y={}", id, x, y);
    Ok(())
}


#[tauri::command]
fn play_sound(path: String) -> Result<(), String> {
    std::thread::spawn(move || {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        let file = BufReader::new(File::open(path).unwrap());
        let source = Decoder::new(file).unwrap();

        sink.append(source);
        sink.sleep_until_end();
    });

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

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_sounds, add_sound, update_sound_position, play_sound, save_sounds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
