const path = require('path')
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const robot = require('suchibot')
const { start, eventBus } = require('./sdl')

app.disableHardwareAcceleration()

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })
  win.setIgnoreMouseEvents(true)
  win.webContents.openDevTools()

  // win.loadURL('http://localhost:3000/keyboard/advance')
  // win.loadURL('http://localhost:3000/keyboard/circle')
  win.loadURL('http://localhost:3000')

  win.setSimpleFullScreen(true)
  return win
}

ipcMain.handle('keydown', (event, key) => {
  console.log('keydown', key)
  const robotKey = robot.Key[key]
  if (!robotKey) {
    throw new Error(`${key} not found`)
    return
  }
  robot.Keyboard.tap(robotKey)
})

app.whenReady().then(() => {
  const win = createWindow()

  eventBus.on('buttonDown', ({ button }) => {
    win.show()
  })
})

// start()