import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(app.getPath('userData'), 'saved.json');

ipcMain.on('save-file', (event, data) => {
  console.log('Saving to:', dataPath); // ADD THIS
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
});

ipcMain.handle('load-file', async () => {
  console.log('Trying to load file:', dataPath); // ADD THIS
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

  win.loadURL('http://localhost:5173');
};

app.whenReady().then(createWindow);
