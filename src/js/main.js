const electron = require('electron')
const {
  ipcRenderer,
  remote
} = electron
var $ = require("jquery");
function addTask(e) {
  const input = document.getElementById('taskin')
  const date = new Date()
  const data = {
    name: input.value,
    date: date.getTime().toString()
  }
  ipcRenderer.send('add-task', data)
  input.value = ''
  return false
}
$(document).ready(() => {
  $('#subform').submit((e) => {
    e.preventDefault()
    addTask(e)
  })
  $('.invert-color').click(function () {
    $('body').toggleClass("night");
  })

  remote.getCurrentWindow().initialtasks.forEach((task) => {
    renderNewTask(task)
  })
})
ipcRenderer.on('deletetask', (e, args) => {
  let task = document.getElementById(args).parentElement.parentElement
  task.remove()

})

ipcRenderer.on('task-added', (e, task) => {
  renderNewTask(task)
})

function renderNewTask(task) {
  let row = document.createElement('div')
  row.setAttribute('class', 'row')
  let col = document.createElement('div')
  col.setAttribute('class', 'task col s6 push-s3')
  let div = document.createElement('div')
  div.className = "ge-checkbox"
  let newtask = document.createElement('input')
  newtask.type = 'checkbox'
  col.onclick = function (e) {
    if (newtask.checked === false) {
      newtask.checked = true
      label.innerHTML = `<s>${label.innerHTML}</s>`
    } else {
      newtask.checked = false
      label.innerHTML = label.innerText
    }
  }
  newtask.id = task.date
  newtask.checked = false
  let label = document.createElement('label')
  label.innerHTML = task.name
  let taskNode = document.getElementById('tasklist')
  taskNode.appendChild(row)
  row.appendChild(col)
  col.appendChild(newtask)
  col.appendChild(label)
  col.ondblclick = function (e) {
    ipcRenderer.send('dbl-del-task', this.firstChild.id)
  }

}
