const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 300
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)
})