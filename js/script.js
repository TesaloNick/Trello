class Trello {
  constructor() {
    this.surface = document.querySelector('.surface')
    this.formAddColumn = document.querySelector('.surface__add-column-form')
    this.tasks = JSON.parse(localStorage.getItem('cards')) || []
    this.counterColumns = JSON.parse(localStorage.getItem('counterColumns')) || 0
  }

  events() {
    this.printTasks(this.tasks)
    this.surface.addEventListener('submit', (e) => this.addTask(e))
    this.surface.addEventListener('click', (e) => {
      this.closeTask(e)
      this.changeTask(e)
      this.addInputForChanging(e)
      this.closeColumn(e)
    })
    this.surface.addEventListener('keypress', (e) => this.changeTask(e))
    this.surface.addEventListener('dblclick', (e) => this.addInputForChanging(e));
    this.surface.addEventListener('submit', (e) => this.addColumn(e))
  }

  printTasks(tasks) {
    this.surface.innerHTML = `
    <form action="" class="surface__add-column-form">
      <input type="text" class="surface__add-column-input" placeholder="+ Add column" required>
    </form> 
    `
    console.log(tasks);
    tasks.map(column => {
      const columnBox = document.createElement('div')
      columnBox.classList.add('surface__column')
      columnBox.id = column.id
      columnBox.innerHTML = `
      <div class="head">
        <div class="head__content">${column.head}</div>
        <div class="head__close"></div>
      </div>
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
        <input type="text" class="surface__task-input" placeholder="+ Add task" required>
      </form>
      `

      document.querySelector('.surface__add-column-form').insertAdjacentElement('beforebegin', columnBox)
    })

    localStorage.setItem('cards', JSON.stringify(this.tasks))   // перезапись localStorage
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

    }
  }

  closeColumn(e) {
    if (e.target.closest('.head__close')) {
      this.tasks = this.tasks.filter(column => column.id !== e.target.closest('.surface__column').id)
      this.printTasks(this.tasks)

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
    }
  }

  changeTask(e) {
    if (e.type === 'keypress' && e.key === "Enter" && e.target.closest('.task__content')) {
      e.preventDefault();
      this.tasks = this.tasks.map(column => e.target.closest('.surface__column').id === column.id ?
        {
          ...column, tasks: column.tasks.map(item => e.target.closest('.task').id === item.id ?
            { ...item, content: e.target.value } :
            item)
        } :
        column
      )

      this.printTasks(this.tasks)
      localStorage.setItem('cards', JSON.stringify(this.tasks))
    }
  }

  addInputForChanging(e) {
    if ((e.target.closest('.task__content') && e.type === 'dblclick') || (e.target.closest('.task__change') && e.type === 'click')) {
      const inputForChanging = e.target.closest('.task').querySelector('.task__content')
      inputForChanging.style.height = e.target.closest('.task').querySelector('.task__content').offsetHeight + 'px'
      inputForChanging.innerHTML = `
          <input type = "text" class="task__new-text" value = '${inputForChanging.textContent}' required>
        `
      inputForChanging.querySelector('.task__new-text').focus()
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

    }
  }
}

class DND extends Trello {
  constructor() {
    super()
    this.task = null
    this.background = null
    this.shiftY = null
    this.shiftX = null
    this.eventMove = null
    this.eventUp = null
    this.eventOver = null
    this.events()
  }

  events() {
    super.events()
    this.surface.addEventListener('mousedown', (e) => this.onMouseDown(e))
  }

  onMouseDown(event) {
    if (event.target.closest('.task')) {
      this.task = event.target.closest('.task')
      this.background = document.createElement('div')
      this.shiftY = event.clientY - this.task.getBoundingClientRect().top;
      this.shiftX = event.clientX - this.task.getBoundingClientRect().left;

      this.eventUp = this.onMouseUp.bind(this)
      document.addEventListener('mouseup', this.eventUp)
      this.eventMove = this.onMouseMove.bind(this)
      document.addEventListener('mousemove', this.eventMove)
    }
  }

  onMouseMove(event) {

    this.background.style.height = this.task.clientHeight + 'px'
    this.background.style.width = this.task.clientWidth + 'px'
    this.background.style.borderRadius = '3px'
    this.background.style.backgroundColor = '#bfbfbf'
    this.task.insertAdjacentElement('afterend', this.background)

    this.task.style.position = 'absolute';
    this.task.style.zIndex = 1000;
    this.task.style.width = this.task.closest('.list').clientWidth + 'px'
    this.task.style.top = event.pageY - this.shiftY + 'px';
    this.task.style.left = event.pageX - this.shiftX + 'px';
  }

  onMouseUp(event) {
    document.removeEventListener('mousemove', this.eventMove);
    if (this.background.clientHeight > 0) {
      this.background.remove()
      this.eventOver = this.onMouseOver.bind(this)
      document.addEventListener('mouseover', this.eventOver)
      this.task.style.position = 'relative';
      this.task.style.top = 'auto'
      this.task.style.left = 'auto'
      this.task.style.zIndex = 'auto';
    }

    document.removeEventListener('mouseup', this.eventUp)
  }

  onMouseOver(event) {
    let targetObject = null
    if (event.target.closest('.surface__column')) {
      this.tasks = this.tasks.map(column => this.task.closest('.surface__column').id === column.id ?
        {
          ...column, tasks: column.tasks.filter(item => {
            if (item.id !== this.task.id) {
              return item.id !== this.task.id
            } else {
              targetObject = item
            }
          })
        } :
        column
      )

      this.tasks = this.tasks.map(column => event.target.closest('.surface__column').id === column.id ?
        { ...column, tasks: [...column.tasks, targetObject] } :
        column
      )

      this.printTasks(this.tasks)
    }
    document.removeEventListener('mouseover', this.eventOver)
  }
}

new DND();