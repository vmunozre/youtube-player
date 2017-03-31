const {app, BrowserWindow, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // Apuntamos al intex.html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Activar consola de desarrollo.
  mainWindow.webContents.openDevTools();

  // Cerrar la aplicación
  mainWindow.on('closed', () => {
    mainWindow = null
  });
}


// Función de lanzamiento de la aplicación.
app.on('ready', () => {

    createWindow();
    /* Preparamos los eventos de teclado */
    globalShortcut.register('MediaPlayPause', () => {
        mainWindow.webContents.send( 'invokeKeyboardAction', 'MediaPlayPause' );
    });
    globalShortcut.register('MediaStop', () => {
        mainWindow.webContents.send( 'invokeKeyboardAction', 'MediaStop' );
    });
    globalShortcut.register('MediaPreviousTrack', () => {
        mainWindow.webContents.send( 'invokeKeyboardAction', 'MediaPreviousTrack' );
    });
    globalShortcut.register('MediaNextTrack', () => {
        mainWindow.webContents.send( 'invokeKeyboardAction', 'MediaNextTrack' );
    });


})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
