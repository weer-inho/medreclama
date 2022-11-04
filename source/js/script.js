//drag&drop логика блоков
const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.second-row')
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})
containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientX)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})
function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = x - box.left - box.width / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

//вставка маски в инпут телефона
const input = document.querySelector('#phone');
input.onfocus = function () {
  input.setAttribute('placeholder', '+7 (___)___-__-__');
}
input.onblur = function () {
  input.removeAttribute('placeholder');
}

//плавное появление
const firstRow = document.querySelector('.first-row');
const secondRow = document.querySelector('.second-row');

setTimeout(() => firstRow.classList.add('shown'), 500);
setTimeout(() => secondRow.classList.add('shown'), 1000);
