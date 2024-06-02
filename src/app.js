const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const { start, eventBus } = require('./sdl')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    // transparent: true,
    webPreferences: {
      
    }
  })
  win.webContents.openDevTools()

  win.loadURL('http://localhost:3000/')

  win.setSimpleFullScreen(true)
  return win
}

app.whenReady().then(() => {
  const win = createWindow()

  eventBus.on('buttonDown', ({ button }) => {
    win.show()
  })
})

// start()