const {app, BrowserWindow, ipcMain, screen, Menu, shell, dialog,globalShortcut } = require('electron')
var windowManager = require('electron-window-manager');
const path = require('path')
const url = require('url')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: screen.availWidth,
    height: screen.availHeight,
    icon: path.join(__dirname, 'src/assets/png/256X256.png'),
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/AdminVdiApp/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  mainWindow.maximize();
  //mainWindow.maximizable = false;
  mainWindow.setMenu(null);

  let newWindow;
  mainWindow.webContents.on('new-window', (event, url, _urlEncodedLoginValues) => {
    event.preventDefault()
    const {width, height } = screen.getPrimaryDisplay().workAreaSize
    const win = new BrowserWindow (
      {
        show: false,
        width: width,
        height: height,
        webPreferences: {
          nativeWindowOpen: true,
          devTools: false
        }
      }
    )
    win.once('ready-to-show', () => win.show())

    win.setMenu(null);

    win.webContents.session.clearStorageData()

    if(_urlEncodedLoginValues)
    {
      win.loadURL(url + '/?' + _urlEncodedLoginValues);
    }
    else{
      win.loadURL(url);
    }

    event.newGuest = win;
    newWindow = win;

    newWindow.on('closed', function () {
      newWindow = null
    })
  })


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null
  })
}

//This code will lock the primary window and will stop to open
// secondary window.
//let myWindow = null
const gotTheLock = app.requestSingleInstanceLock();
console.log('gotTheLock: ' + gotTheLock);
if (!gotTheLock) {
  app.quit()
}
else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized())
      {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startApi)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  //console.log("8");

  // On OS X it is common for applications and their menu bar
  // // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   //console.log("9");
  //   app.quit()
  // }

  app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()

  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const os = require('os');
var apiProcess = null;

//This method is for Debugging App with Local API.
//Change name of this method to startApi or uncomment for debugging only
//For Production Build - make sure to changes it to startApi2 or commment.
function startApi2() {
    if (mainWindow == null) {
      createWindow();
      mainWindow.maximize;
    }
}

//For Debugging App with InProcess API change name of this method to startApi2 or Comment
//For Production Build - Make sure to changes it to startApi or uncommment.
function startApi() {
  var proc = require('child_process').spawn;

  //  run server
  if (os.platform() === 'win32' || os.platform() === 'win64') {
    //windows
    var apipath = path.join(__dirname, '..\\AdminVdiApp\\src\\bin\\dist\\win\\AdminVdiApp.exe')
    console.log(apipath);
  }
  else
  {
     //osx
     apipath = path.join(__dirname, '..//AdminVdiApp//src//bin//dist//linux//AdminVdiApp')
     console.log(apipath);
  }

  apiProcess = proc(apipath)

  apiProcess.stdout.on('data', (data) => {
    writeLog(`stdout: ${data}`);
    if (mainWindow == null) {
      createWindow();
      mainWindow.maximize;
    }
  });
}

//Kill process when electron exits
process.on('exit', function () {
  writeLog('exit');
  if(apiProcess)
  {
    apiProcess.kill();
  }
});

function writeLog(msg){
  //console.log(msg);
}

function openWindow(urls)
{
  windowManager.init({
    'onLoadFailure': function(window){
        //window.loadURL('/404.html');
        window.write('<h3> Cannot load the requested page! </h3>');
    }
  });

  closeMyWindow();
  let _url = url.format({
    pathname: path.join(__dirname, 'dist/AdminVdiApp/index.html'),
    protocol: 'file:',
    slashes: true
  })
  _url = _url + '#/exam-preview';

  const {width, height } = screen.getPrimaryDisplay().workAreaSize;

  windowManager.open(
    'docviewer',
    "Exam Preview",_url,
    false,
    {
      'menu': null,
      'title': 'Exam Preview',
      // 'width': width * .75 ,
      // 'height': height * .75,
      'width': 1280 ,
      'height': 768,
      'position': 'default',
      'layout': 'simple',
      'showDevTools': false,
      'resizable': true
    }
  );
}
function closeMyWindow(){
  var win = windowManager.get('docviewer');
  if(win)
  {
    win.close('docviewer');
  }
}


ipcMain.on('openWindow', (event, _url) => {
  openWindow(_url)
})

ipcMain.on('closeWindow', (event, args) => {
  closeMyWindow()
})
