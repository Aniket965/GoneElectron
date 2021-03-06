const electron = require('electron')
const os = require('os')
const storage = require('electron-json-storage')
const dataPath = storage.getDataPath()
const { app, BrowserWindow, ipcMain} = electron
const SECS_IN_DAY = 24 * 60 * 60
storage.setDataPath(os.tmpdir())
var eNotify
let tasks = new Array()
let mainWindow;
let splash;

app.on('ready', _ => {

   mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 780,
    height: 460,
    show:false
  })
  eNotify = require('electron-notify');
  storage.get('tasks', (err, data) => {
    if (!Object.keys(data).length === 0 && data.constructor === Object) {
      tasks.push(data)
    }
    splash = new BrowserWindow({width: 780, height: 460, frame: false, alwaysOnTop: true});
    splash.loadURL(`file://${__dirname}/splash.html`);
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.setMenu(null)
    mainWindow.initialtasks = data
    // mainWindow.webContents.openDevTools()
    mainWindow.once('ready-to-show', () => {
      setTimeout(function(){
        splash.destroy();
        mainWindow.show();
      },2000)
   
    });
    checkForTaskTime(mainWindow)
  })
})
ipcMain.on('add-task', function (event, arg) {
  tasks.push(arg)
  storage.set('tasks', tasks, function (error) {
    if (error) throw error
  })
  event.sender.send('task-added', arg)
})
ipcMain.on('dbl-del-task',function (event,arg) {
  mainWindow.webContents.send('deletetask', arg)
  tasks.filter((task) => {
    if(task.date === arg)
      return false
    else
      return true
  })
  storage.set('tasks', tasks, function (error) {
    if (error) throw error
  })

})

function checkForTaskTime (mainWindow) {
  setInterval(_ => {
    const prev_tasks = tasks
    let ischanged = false
    tasks = tasks.filter((task) => {
      let current_Date = new Date()
      let current_time = current_Date.getTime()
      const timeDifference = (current_time - parseInt(task.date)) / 1000

      if (timeDifference > SECS_IN_DAY) {
        /**
        * Deletes from ui
        */
        // Notify users that task deleted
        mainWindow.webContents.send('deletetask', task.date)
        eNotify.notify({ title: 'Task Removed', text: `${task.name}` })
        ischanged = true
        return false
      } else {
        return true
      }
    })
    if (ischanged) {
      /**
       * updates the storage if some thing deleted
       */
      storage.set('tasks', tasks, function (error) {
        if (error) throw error
      })

    }
  }, 1000)
}
