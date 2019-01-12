const { app, BrowserWindow } = require('electron');
const Config = require('electron-store');

let mainWindow;
const config = new Config({
  defaults: {
    bounds: {
      width: 240,
      height: 125,
    },
  },
});

function createWindow() {
  const { width, height, x, y } = config.get('bounds');

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    // resizable: false,
    alwaysOnTop: true,
    webPreferences: { backgroundThrottling: false },
  });

  SetConfigOnCreateWindow();
  mainWindow.loadFile('index.html');

  ['resize', 'move'].forEach(event => {
    mainWindow.on(event, () => {
      config.set('bounds', mainWindow.getBounds());
    });
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

function SetConfigOnCreateWindow() {
  var date = new Date();
  // date = new Date(date.getFullYear(), date.getMonth(), date.setDate() - 1);
  config.set('date', date);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})