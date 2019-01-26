//@ts-check
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const Config = require('electron-store');

let mainWindow;
let preferenceWindow;

const config = new Config({
  defaults: {
    bounds: {
      width: 240,
      height: 150,
    },
    workInterval: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakAfter: 3,
    targetInterval: 6,
    currentInterval: 0,
    alwaysOnTop: 'true',
    autoStartTimer: 'false',
    notification: 'false',
    windowResizable: 'true',
  },
});

function createWindow() {
  const { width, height, x, y } = config.get('bounds');
  const alwaysOnTop = (config.get('alwaysOnTop') === 'true' ? true : false);
  const resizable = (config.get('windowResizable') === 'true' ? true : false);

  mainWindow = new BrowserWindow({
    width,
    minWidth: 120,
    height,
    x,
    y,
    alwaysOnTop,
    resizable,
    webPreferences: { backgroundThrottling: false },
  });

  mainWindow.loadFile('index.html');

  ['resize', 'move'].forEach(event => {
    mainWindow.on(event, () => {
      config.set('bounds', mainWindow.getBounds());
    });
  });

  mainWindow.on('close', () => app.quit());
};

app.on('ready', () => {
  createWindow()
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createPreferenceWindow() {
  preferenceWindow = new BrowserWindow({
    width: 350,
    height: 350,
    alwaysOnTop: true,
    title: 'Preference',
  });
  preferenceWindow.loadURL(`file://${__dirname}/preference.html`);
  preferenceWindow.on('close', () => preferenceWindow = null);
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('preference:save', event => {
  setAlwaysOnTop();
  setWindowResizable();
  mainWindow.webContents.send('preference:save', event);
  preferenceWindow.close();
});

function setAlwaysOnTop() {
  let bool;
  let isAlwaysOnTop = config.get('alwaysOnTop');
  if (isAlwaysOnTop === 'true') {
    bool = true;
  } else {
    bool = false;
  }
  mainWindow.setAlwaysOnTop(bool);
}

function setWindowResizable() {
  let bool;
  if (config.get('windowResizable') === 'true') {
    bool = true;
  } else {
    bool = false;
  }
  mainWindow.setResizable(bool);
}

const menuTemplate = [
  {
    label: app.getName(),
    submenu: [
      {
        label: 'Toggle Preferense',
        accelerator: 'CmdOrCtrl+P',
        click() {
          if (!preferenceWindow) {
            createPreferenceWindow();
          } else {
            preferenceWindow.close();
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Start/Stop',
        accelerator: 'CmdOrCtrl+S',
        click() {
          mainWindow.webContents.send('menu:start/stop');
        }
      },
      {
        label: 'Work/Break',
        accelerator: 'CmdOrCtrl+D',
        click() {
          mainWindow.webContents.send('menu:work/break');
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: []
  });
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'toggledevtools' },
    ]
  });
}