const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('robotjs', {
  moveMouse(delta) {
    ipcRenderer.invoke('moveMouse', delta)
  },
  mouseClick(button, double) {
    ipcRenderer.invoke('mouseClick', button, double)
  }
})