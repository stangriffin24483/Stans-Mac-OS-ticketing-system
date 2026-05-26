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

  // In development, connect to Vite dev server
  let url = 'http://localhost:5173'
  
  // If the dev server isn't available, try common alternative ports
  if (!process.env.VITE_DEV_SERVER_URL) {
    // Development: connect to localhost
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    url = process.env.VITE_DEV_SERVER_URL
    win.loadURL(url)
  }
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
