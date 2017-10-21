const electron = require('electron')
const { app, BrowserWindow, ipcMain, remote,ipcRenderer } = electron
let tasks = []
app.on('ready', _ => {
  const mainWindow = new BrowserWindow({
    width: 780,
    height: 460
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.setMenu(null)
  // mainWindow.webContents.openDevTools()

})
ipcMain.on('add-task', function (event, arg) {
  tasks.push(arg)
  event.sender.send('task-added',arg)
});
