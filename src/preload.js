const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('GamepadControllerJSBridge', {
  openApp(app) {
    ipcRenderer.invoke('moveMouse', app)
  },
  keydown(key) {
    console.log('keydown', key)
    ipcRenderer.invoke('keydown', key)
  }
})