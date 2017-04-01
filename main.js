const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const storage = require('electron-storage');

const filePath = 'youtube-player/data.json';

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 720,icon: __dirname + '/assets/icon.ico'});

  // Apuntamos al intex.html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Activar consola de desarrollo.
  //mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
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

    //Mensajes asincronos para guardar datos
    ipcMain.on('async-save-data', (event, data) => {
      console.log('datos guardados: ');
      console.log(data);  // prints "ping"
      storage.set(filePath, data, (err) => {
          if (err) {
              console.error(err);
          }else{
              console.log('Archivo creado')
          }
      });
      //event.sender.send('asynchronous-reply', 'pong')
    });

    ipcMain.on('async-load-data', (event, arg) => {
      storage.get(filePath, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log('datos cargados: ');
          console.log(data);
          event.sender.send('async-load-data-reply', data);
        }
      });

    });



});

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
