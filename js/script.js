class Trello {
  constructor() {
    this.surface = document.querySelector('.surface')
    this.formAddColumn = document.querySelector('.surface__add-column-form')
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
    this.counterColumns = JSON.parse(localStorage.getItem('counterColumns')) || 0
    this.events()
  }

  events() {
    this.printTasks(this.tasks)
    this.surface.addEventListener('mousedown', (e) => this.catchItem(e))
    this.surface.addEventListener('submit', (e) => this.addTask(e))
    this.surface.addEventListener('click', (e) => this.closeTask(e))
    this.surface.addEventListener('click', (e) => this.changeTask(e))
    this.surface.addEventListener('submit', (e) => this.addColumn(e))
  }

  printTasks(tasks) {
    this.surface.innerHTML = `
    <form action="" class="surface__add-column-form">
      <input type="text" class="surface__add-column-input" placeholder="Add column">
    </form> 
    `

    tasks.map(column => {
      const columnBox = document.createElement('div')
      columnBox.classList.add('surface__column')
      columnBox.id = column.id
      columnBox.innerHTML = `
      <div class="surface__head">${column.head}</div>
      <div class="list">
        ${column.tasks.map(item => `
          <div class='task' id=${item.id}>
            <div class="task__content">${item.content}</div>
            <div class="task__change"></div>
            <div class="task__close"></div>
          </div>
        `).join('')} 
      </div>
      <form action="" class="surface__task-form">
        <input type="text" class="surface__task-input" placeholder="Add task">
      </form>
      `

      document.querySelector('.surface__add-column-form').insertAdjacentElement('beforebegin', columnBox)
    })

    localStorage.setItem('tasks', JSON.stringify(this.tasks))   // перезапись localStorage
  }

  addColumn(e) {
    e.preventDefault()

    if (e.target.closest('.surface__add-column-form')) {
      this.tasks.push({
        id: 'column' + this.counterColumns,
        head: e.target.closest('.surface__add-column-form').querySelector('.surface__add-column-input').value,
        tasks: []
      })
      this.counterColumns++
      localStorage.setItem('counterColumns', JSON.stringify(this.counterColumns))
      this.printTasks(this.tasks)
      console.log(this.tasks);
    }
  }

  addTask(e) {
    e.preventDefault()
    if (e.target.closest('.surface__task-form')) {
      this.tasks.map(column => {
        if (e.target.closest('.surface__column').id == column.id) {
          column.tasks.push({
            id: e.target.closest('.surface__column').id + '_' + Math.round(Math.random() * 100000000000000000),
            content: e.target.closest('.surface__task-form').querySelector('.surface__task-input').value
          })
        }
      })
      this.printTasks(this.tasks)
      console.log(this.tasks);
    }
  }

  changeTask(e) {
    if (e.target.closest('.task__change')) {
      this.tasks.map(column => {
        if (e.target.closest('.surface__column').id = column.id) {

        }
      })

    }
  }

  closeTask(e) {
    if (e.target.closest('.task__close')) {
      this.tasks.map(column => {
        if (e.target.closest('.surface__column').id = column.id) {
          const newList = column.tasks.filter(task => task.id !== e.target.closest('.task').id)
          column.tasks = newList
        }
      })
      this.printTasks(this.tasks)
      console.log(this.tasks);
    }
  }

  catchItem(e) {
    if (e.target.closest('.task')) {
      let task = e.target.closest('.task')
      let background = document.createElement('div')
      let shiftY = e.clientY - task.getBoundingClientRect().top;
      let shiftX = e.clientX - task.getBoundingClientRect().left;
      // console.log(task.id);

      let onMouseMove = function (event) {
        background.style.height = task.clientHeight + 'px'
        background.style.width = task.clientWidth + 'px'
        background.style.borderRadius = '3px'
        background.style.backgroundColor = '#bfbfbf'
        task.insertAdjacentElement('afterend', background)

        task.style.position = 'absolute';
        task.style.zIndex = 1000;
        task.style.width = task.closest('.list').clientWidth + 'px'
        task.style.top = event.pageY - shiftY + 'px';
        task.style.left = event.pageX - shiftX + 'px';

      }

      function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);
        if (background.clientHeight > 0) {
          background.remove()
          task.style.position = 'relative';
          task.style.top = 'auto'
          task.style.left = 'auto'
          task.style.zIndex = 'auto';

          function onMouseOver(event) {
            let targetObject = null
            if (event.target.closest('.surface__column')) {
              this.tasks.map(column => {
                if (column.id === task.closest('.surface__column').id) {
                  column.tasks.filter(item => item.id !== task.id)
                }
              })
              console.log(event.target.closest('.surface__column').id, task.closest('.surface__column').id);
              event.target.closest('.surface__column').querySelector('.list').append(task)
            }
            console.log(this.tasks);
            document.onmouseover = null
          }
          document.onmouseover = onMouseOver.bind(this)
        }

        document.onmouseup = null
      }

      document.onmouseup = onMouseUp.bind(this)
      document.addEventListener('mousemove', onMouseMove)
    }
  }
}

let trello = new Trello();