


class Trello {
  constructor() {
    this.surface = document.querySelector('.surface')
    this.formAddColumn = document.querySelector('.surface__add-column-form')
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
    this.counterColumns = JSON.parse(localStorage.getItem('counterColumns')) || 0
    // this.events()
  }

  events() {
    this.printTasks(this.tasks)
    // this.surface.addEventListener('mousedown', (e) => this.catchItem(e))
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

  closeColumn(e) {
    if (e.target.closest('.head__close')) {
      this.tasks = this.tasks.filter(column => column.id !== e.target.closest('.surface__column').id)
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
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
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
      console.log(this.tasks);
    }
  }

  // catchItem(e) {
  //   if (e.target.closest('.task')) {
  //     let task = e.target.closest('.task')
  //     let background = document.createElement('div')
  //     let shiftY = e.clientY - task.getBoundingClientRect().top;
  //     let shiftX = e.clientX - task.getBoundingClientRect().left;

  //     let onMouseMove = function (event) {
  //       background.style.height = task.clientHeight + 'px'
  //       background.style.width = task.clientWidth + 'px'
  //       background.style.borderRadius = '3px'
  //       background.style.backgroundColor = '#bfbfbf'
  //       task.insertAdjacentElement('afterend', background)

  //       task.style.position = 'absolute';
  //       task.style.zIndex = 1000;
  //       task.style.width = task.closest('.list').clientWidth + 'px'
  //       task.style.top = event.pageY - shiftY + 'px';
  //       task.style.left = event.pageX - shiftX + 'px';

  //     }

  //     function onMouseUp(event) {
  //       document.removeEventListener('mousemove', onMouseMove);
  //       if (background.clientHeight > 0) {
  //         background.remove()
  //         document.onmouseover = onMouseOver.bind(this)
  //         task.style.position = 'relative';
  //         task.style.top = 'auto'
  //         task.style.left = 'auto'
  //         task.style.zIndex = 'auto';

  //         function onMouseOver(event) {
  //           let targetObject = null
  //           if (event.target.closest('.surface__column')) {
  //             this.tasks = this.tasks.map(column => task.closest('.surface__column').id === column.id ?
  //               {
  //                 ...column, tasks: column.tasks.filter(item => {
  //                   if (item.id !== task.id) {
  //                     return item.id !== task.id
  //                   } else {
  //                     targetObject = item
  //                   }
  //                 })
  //               } :
  //               column
  //             )

  //             this.tasks = this.tasks.map(column => event.target.closest('.surface__column').id === column.id ?
  //               { ...column, tasks: [...column.tasks, targetObject] } :
  //               column
  //             )

  //             this.printTasks(this.tasks)
  //           }
  //           document.onmouseover = null
  //         }
  //       }

  //       document.onmouseup = null
  //     }

  //     document.onmouseup = onMouseUp.bind(this)
  //     document.addEventListener('mousemove', onMouseMove)
  //   }
  // }
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
      // document.addEventListener('mouseup', this.onMouseUp.bind(this))
      this.eventMove = this.onMouseMove.bind(this)
      document.addEventListener('mousemove', this.eventMove)
      // document.addEventListener('mousemove', this.onMouseMove.bind(this))
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
    // document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    if (this.background.clientHeight > 0) {
      this.background.remove()
      this.eventOver = this.onMouseOver.bind(this)
      document.addEventListener('mouseover', this.eventOver)
      // document.addEventListener('mouseover', this.onMouseOver.bind(this))
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
      console.log(this.tasks);
      this.printTasks(this.tasks)
    }
    document.removeEventListener('mouseover', this.eventOver)
    // document.removeEventListener('mouseover', this.onMouseOver.bind(this))
  }
}

let trello = new DND();