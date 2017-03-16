const path = require('path')
const glob = require('glob')
const electron = require('electron')
const autoUpdater = require('./auto-updater')
const electronLocalshortcut = require('electron-localshortcut')

const BrowserWindow = electron.BrowserWindow
const app = electron.app

const Tray =electron.Tray
const ipcMain=electron.ipcMain
const nativeImage=electron.nativeImage


let tray = undefined
let window = undefined

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron APIs')

var mainWindow = null

function initialize () {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  loadDemos()

  function createWindow () {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName()
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    electronLocalshortcut.register(mainWindow, 'Ctrl+A', () => {
        console.log('You pressed ctrl & A')
        mainWindow.minimize()
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+B', () => {
        console.log('You pressed ctrl & B')
        mainWindow.maximize()
    });


    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {

  let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(icon)

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow()

  })
   createWindow()
    autoUpdater.initialize()
  })

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    showWindow()
  }
}


  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })


}



const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = mainWindow.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }
  mainWindow.setPosition(x, y, false)
  mainWindow.show()
  mainWindow.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('resizeMainForScripts', function (e, width, height) {
    mainWindow.setSize(width, height)
    mainWindow.webContents.send('showScripts')
})
// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos () {
  var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach(function (file) {
    require(file)
  })
  autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function () { app.quit() })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}

// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw
7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkZCg87wZW7ewA
AAp1JREFUOMuV1U2IVlUcx/HPnbc0MWwEF40hRWRQmWhEUi4KorlTQ0zQKgqSxKinRYuWrdq0iIp8DAy
CFmYUUVTYY0Qw0SsYVDQRlFlQU4o4VDMUY9NzWtz/45znzo3yv7n/l3O+53fOPS+F/7R9G0l34Vlap/x
PG+gPby76471jpJdxI4p/x5QrakPVZ3yI4lLSLH4LpetIT5N24AWKpZXAW4boXogFnGxQXEzhdQYHl0v
pbtJkBIOkBqXpVhzAWIPi8hocxCyH5qp0e10oHY6BNy3P7szULyc9hzkGTjat8WPRqctkD3QORrJ211J
srPV7CKP4i7S6CXxF+GtY2lG5D5yg+D6bckHaRXs463dV+OtJVzeBj4Q/inuy2uf4NYPvyVR38Vn4GzD
ZAC5ezHbITsqtEU8HvGcjpFblDncpDma16yhvqit+c3mLuQj3Vm7rJ4r3kW+z+6sD80aKQWcivwm318B
pHk9mA11PuSXil/B1thyrSA9HMI8nMtYNlDszcKdbHVcLkduCO0L1VxTv1VTv5plR3lrCuzga+c2YqB2
QNEfqjV7EWl8c8X78kKleTTfWeuA49maDjlNuz8CHFykOYDEabKvg0Jqh+AB/Z4D7qs+h03gbxyK/FVf
WL6FfsC/8tdGoZ0/hRKZ6A+2pUP1jdZecse01cGcBr2YNzqdcG6q/oDgS+7e3XLeF6j/wTvzM6Lfi2nQ
KP8e0P6Ezn9X2488MvLnW75vwP2wCr8J5eD4upsxaHZzOwNNZcU2c3FfwWg1cDuISfIxH6fzedE8G90s
8nuXH8B0eoXNc/6tQjsQfXaQz0/BEXUD3W4oF0hQPflTlJwZIl+FcOp86e2vvoj1Le6I/P974ZA2dBXk
97qQ13Z8+3PS0+AdjKa1R95YOZgAAAABJRU5ErkJggg==`