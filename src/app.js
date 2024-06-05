const path = require('path')
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const robot = require('suchibot')
const { start, eventBus } = require('./sdl')
const puppeteer = require('./puppeteer')

app.disableHardwareAcceleration()

/** Type {BrowserWindow} */
let keyboardWindow = null;

const createKeyboardWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })
  win.setIgnoreMouseEvents(true)
  // win.webContents.openDevTools()

  // win.loadURL('http://localhost:3000/keyboard/advance')
  // win.loadURL('http://localhost:3000/keyboard/circle')
  win.loadURL('http://localhost:3000/keyboard/virtual')
  // win.loadURL('http://localhost:3000')

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
  const win = createKeyboardWindow()

  puppeteer.eventBus.on(puppeteer.EventName.showKeyboard, () => {
    console.log('showKeyboardWindow')
    win.show()
  })
  puppeteer.eventBus.on(puppeteer.EventName.hideKeyboard, () => {
    console.log('showKeyboardWindow')
    win.hide()
  })

  puppeteer.start()
})

start()