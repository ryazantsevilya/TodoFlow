'use strict'

import { app, BrowserWindow } from 'electron'

const appConfig = require('electron-settings')

var path = require('path')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function windowStateKeeper (windowName) {
  let window, windowState
  function setBounds () {
    if (appConfig.has(`windowState.${windowName}`)) {
      windowState = appConfig.getSync()['windowState'][windowName]
      return
    }
    // Default
    windowState = {
      x: undefined,
      y: undefined,
      width: 1000,
      height: 800
    }
  }
  function saveState () {
    if (!windowState.isMaximized) {
      windowState = window.getBounds()
    }
    windowState.isMaximized = window.isMaximized()
    appConfig.set(`windowState.${windowName}`, windowState)
  }
  function track (win) {
    window = win;
    ['resize', 'move', 'close'].forEach(event => {
      win.on(event, saveState)
    })
  }

  setBounds()

  return ({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track
  })
}

function createWindow () {
  const mainWindowStateKeeper = windowStateKeeper('main')
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'TodoFLow',
    useContentSize: true,
    frame: false,
    icon: path.join(__dirname, 'assets/logo.png'),
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height
  })

  mainWindowStateKeeper.track(mainWindow)

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, 'assets/logo.png'))
  }

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
