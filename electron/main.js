import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const dataPath = path.join(app.getPath('userData'), 'saved.json');

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: config.OPENAI_API_KEY,
});

// Handle chat requests from renderer
ipcMain.handle('openai-chat', async (event, { messages }) => {
  try {
    const result = await api.chat.completions.create({
      model: 'google/gemma-3n-e4b-it',
      messages,
    });
    return result.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI API error:", err);
    throw new Error(err.message || "Unknown error");
  }
});

ipcMain.on('save-file', (event, data) => {
  console.log('Saving to:', dataPath);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
});

ipcMain.handle('load-file', async () => {
  console.log('Trying to load file:', dataPath);
  if (fs.existsSync(dataPath)) {
    const content = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } else {
    return [];
  }
});

ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePaths.length) {
    return { success: false, message: 'No file selected' };
  }
  const filePath = filePaths[0];
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return { success: true, content, filePath };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1820,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // THE FIX: Check if we're in development or production
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    win.loadURL('http://localhost:5174');
    win.webContents.openDevTools();
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../build/index.html'));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});