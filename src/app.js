const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const robot = require('../../suchibot')
const { start, eventBus } = require('./sdl')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    // transparent: true,
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })
  win.webContents.openDevTools()

  win.loadURL('http://localhost:3000/keyboard/advance')

  // win.setSimpleFullScreen(true)
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