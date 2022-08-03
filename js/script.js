class Trello {
  constructor() {
    this.surface = document.querySelector('.surface')
  }

  events() {
    this.surface.addEventListener('mousedown', (e) => this.catchItem(e))
    this.surface.addEventListener('submit', (e) => this.addTask(e))
    // this.surface.addEventListener('click', (e) => this.closeTask(e))
    this.surface.addEventListener('submit', (e) => this.addSurfaceBox(e))
  }

  addSurfaceBox(e) {
    e.preventDefault()
    if (e.target.closest('.surface__add-box-form')) {
      const newColumn = document.createElement('div')
      newColumn.classList.add('surface__box')
      newColumn.innerHTML = `
        <div class="surface__head">${e.target.closest('.surface__add-box-form').querySelector('.surface__add-box-input').value}</div>
        <div class="list"></div>
        <form action="" class="surface__form">
          <input type="text" class="surface__input" placeholder="Add task">
        </form>
      `
      e.target.closest('.surface__add-box-form').insertAdjacentElement('beforebegin', newColumn)
      e.target.closest('.surface__add-box-form').querySelector('.surface__add-box-input').value = ''
    }
  }

  addTask(e) {
    e.preventDefault()
    if (e.target.closest('.surface__form')) {
      // console.log(e.target.closest('.surface__form').querySelector('.surface__input').value);
      const newTask = document.createElement('div')
      newTask.classList.add('task')
      newTask.innerHTML = `
        <div class="task__content">${e.target.closest('.surface__form').querySelector('.surface__input').value}</div>
      `
      e.target.closest('.surface__box').querySelector('.list').append(newTask)
      e.target.closest('.surface__form').querySelector('.surface__input').value = ''
    }
  }


  // <div class="task__change"></div>
  // <div class="task__close"></div>

  // changeTask(e) {
  //   if (e.target.closest('.task__change')) {
  //     e.target.closest('.task').querySelector('.task__content').innerHTML = `
  //       <form action="" class="surface__form">
  //         <input type="text" class="surface__input" placeholder="Add task">
  //       </form>
  //     `
  //   }
  // }

  // closeTask(e) {
  //   if (e.target.closest('.task__close')) {
  //     e.target.closest('.task').remove()
  //   }
  // }

  catchItem(e) {
    if (e.target.closest('.task')) {
      let task = e.target.closest('.task')
      let background = document.createElement('div')
      let shiftY = e.clientY - task.getBoundingClientRect().top;
      let shiftX = e.clientX - task.getBoundingClientRect().left;

      function onMouseMove(event) {
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

      function onMouseOver(event) {
        // console.log(background.clientHeight);
        if (event.target.closest('.surface__box')) {
          console.log(event.target.closest('.surface__box'));
          event.target.closest('.surface__box').querySelector('.list').append(task)
        }
        document.onmouseover = null
      }

      function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);

        if (background.clientHeight > 0) {

          background.remove()
          task.style.position = 'relative';
          task.style.top = 'auto'
          task.style.left = 'auto'
          task.style.zIndex = 'auto';
        }
        document.onmouseup = null
      }

      document.addEventListener('mousemove', onMouseMove)
      document.onmouseup = onMouseUp.bind(this)
      document.onmouseover = onMouseOver.bind(this)
    }
  }
}

let trello = new Trello();
trello.events()