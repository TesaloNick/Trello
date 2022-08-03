class Trello {
  constructor() {
    this.surface = document.querySelector('.surface')
  }

  events() {
    this.surface.addEventListener('mousedown', (e) => this.catchItem(e))
    // this.surface.addEventListener('mouseover', (e) => this.onMouseOver(e))
  }

  onMouseOver(e) {
    if (e.target.closest('.surface__box')) {
      console.log(e.target.closest('.surface__box'));
    }
  }

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
        if (event.target.closest('.surface__box')) {
          console.log(event.target.closest('.surface__box'));
          event.target.closest('.surface__box').querySelector('.list').append(task)
        }
        document.onmouseover = null
      }

      function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);

        // if (background.clientHeight > 0) {
        background.remove()
        task.style.position = 'relative';
        task.style.top = 'auto'
        task.style.left = 'auto'
        task.style.zIndex = 'auto';


        // }
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