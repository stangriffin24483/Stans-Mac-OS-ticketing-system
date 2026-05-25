const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const url = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '..', 'dist', 'index.html')}`
  win.loadURL(url)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('notify', (event, { title, body }) => {
  new Notification({ title, body }).show()
})
