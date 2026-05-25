const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  notify: (opts) => ipcRenderer.send('notify', opts)
})
