const electron = require('electron')
const os = require('os');
const storage = require('electron-json-storage');
storage.setDataPath(os.tmpdir());
const dataPath = storage.getDataPath();
const { app, BrowserWindow, ipcMain, remote,ipcRenderer } = electron
let tasks = []

app.on('ready', _ => {
  const mainWindow = new BrowserWindow({
    width: 780,
    height: 460
  })
  storage.get('tasks',(err,data)=>{
    tasks = data
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.setMenu(null)
    mainWindow.initialtasks = data
    mainWindow.webContents.openDevTools()
  })
  

  
  console.log(dataPath);
})
ipcMain.on('add-task', function (event, arg) {
  tasks.push(arg)
  storage.set('tasks', tasks, function(error) {
    if (error) throw error;
  });
  event.sender.send('task-added',arg)
});
