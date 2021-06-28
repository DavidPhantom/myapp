import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import fs from 'fs';
import DatabaseService from '../../src/backend/app/Database/DatabaseService';

const createAppDir = () => {
  const appDataDir = path.join(process.env.LOCALAPPDATA || process.env.HOME, 'MyApp');
  global.appDataDir = appDataDir;
  fs.mkdirSync(appDataDir, { recursive: true });
};

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  createAppDir();
  global.databaseService = new DatabaseService();
  await global.databaseService.initDatabase();
  createWindow();
});

app.on('window-all-closed', async () => {
  await global.databaseService.knex.destroy();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
