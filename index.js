//@ts-check
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const Config = require('electron-store');

let mainWindow;
let addWindow;

const config = new Config({
  defaults: {
    bounds: {
      width: 240,
      height: 125,
    },
    workInterval: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakAfter: 3,
    targetInterval: 6,
    currentInterval: 0,
    alwaysOnTop: true,
    autoStartTimer: false,
  },
});

function createWindow() {
  const { width, height, x, y } = config.get('bounds');
  const alwaysOnTop = config.get('alwaysOnTop');

  mainWindow = new BrowserWindow({
    width,
    minWidth: 120,
    height,
    x,
    y,
    // resizable: false,
    alwaysOnTop,
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
  addWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'Preference',
  });
  addWindow.loadURL(`file://${__dirname}/preference.html`);
  addWindow.on('close', () => addWindow = null);
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

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Preferense',
        accelerator: 'CmdOrCtrl+P',
        click() {
          if (!addWindow) {
            createPreferenceWindow();
          }
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      },
    ]
  }
];


if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
  });
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWdindow) {
          focusedWdindow.toggleDevTools();
        }
      }
    ]
  });
}