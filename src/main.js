const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
app.on('ready', _ => {
  const mainWindow = new BrowserWindow({
    width: 780,
    height: 460
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.setMenu(null)
})
