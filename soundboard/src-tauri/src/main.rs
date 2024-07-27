// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::io::Read;
use std::path::PathBuf;
use std::io::Write;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Sound {
    id: String,
    name: String,
    path: String,
    x: f64,
    y: f64,
}

#[tauri::command]
fn get_sounds(app_handle: tauri::AppHandle) -> Vec<Sound> {
    let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let sounds_dir = app_dir.join("sounds");
    let mut sounds = Vec::new();

    if let Ok(entries) = fs::read_dir(sounds_dir) {
        for entry in entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_file() {
                    if let Some(file_name) = entry.file_name().to_str() {
                        sounds.push(Sound {
                            id: Uuid::new_v4().to_string(),
                            name: file_name.to_string(),
                            path: entry.path().to_str().unwrap().to_string(),
                            x: 0.0,
                            y: 0.0,
                        });
                    }
                }
            }
        }
    }

    sounds
}

#[tauri::command]
fn add_sound(app_handle: tauri::AppHandle, name: String, path: String, x:f64, y:f64) -> Result<Sound, String> {
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
            get_sounds, add_sound, update_sound_position
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
