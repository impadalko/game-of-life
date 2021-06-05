let columns = 20
let rows = 20
let board

let isDrawing = false
let isErasing = false

window.addEventListener('mousedown', () => {
  isDrawing = true
})

window.addEventListener('mouseup', () => {
  isDrawing = false
})

const eraseCheckbox = document.getElementById('erase-checkbox')
eraseCheckbox.addEventListener('input', (e) => {
  isErasing = e.target.checked
})

const createBoard = () => {
  return Array.from(Array(rows), () => new Array(columns).fill(false))
}

const createGrid = (event) => {
  const table = document.getElementById('table')
  table.innerHTML = ''

  if (event.target[0].value) columns = parseInt(event.target[0].value)
  if (event.target[1].value) rows = parseInt(event.target[1].value)
  if (event.target[2].value)
    document.querySelector(':root').style.setProperty('--grid-size', event.target[2].value)
  board = createBoard()

  for (let i = 0; i < rows; i++) {
    const row = table.insertRow()
    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell()
      cell.id = `${i}-${j}`
      cell.addEventListener('click', (e) => {
        e.target.classList.toggle('selected')
        board[i][j] = !board[i][j]
      })
      cell.addEventListener('mousemove', (e) => {
        if (!isDrawing) return
        if (isErasing) {
          e.target.classList.remove('selected')
          board[i][j] = false
        } else {
          e.target.classList.add('selected')
          board[i][j] = true
        }
      })
    }
  }
  event.preventDefault()
}

const gridForm = document.getElementById('grid-form')
gridForm.addEventListener('submit', createGrid)

const setCellFalse = (board, i, j) => {
  board[i][j] = false
  const cell = document.getElementById(`${i}-${j}`)
  cell.classList.remove('selected')
}

const setCellTrue = (board, i, j) => {
  board[i][j] = true
  const cell = document.getElementById(`${i}-${j}`)
  cell.classList.add('selected')
}

const countNeighbors = (row, column) => {
  const x = [-1, 0, 1]
  let count = 0
  for (const i of x) {
    for (const j of x) {
      if (i === 0 && j === 0) continue
      if (row + i >= 0 && row + i < rows)
        if (column + j >= 0 && column + j < columns && board[row + i][column + j]) count++
    }
  }
  return count
}

const frameAdvance = () => {
  if (!board) return
  const newBoard = createBoard()
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const count = countNeighbors(i, j)
      if (count == 3) setCellTrue(newBoard, i, j)
      else if (count == 2) newBoard[i][j] = board[i][j]
      else setCellFalse(newBoard, i, j)
    }
  }
  board = newBoard
}

const advanceButton = document.getElementById('advance-button')
advanceButton.addEventListener('click', frameAdvance)

const playButton = document.getElementById('play-button')

let interval = null
const play = () => {
  interval = window.setInterval(frameAdvance, 250)
  playButton.innerHTML = 'Pause'
}
const pause = () => {
  window.clearInterval(interval)
  interval = null
  playButton.innerHTML = 'Play'
}

playButton.addEventListener('click', () => {
  if (!board) return
  if (!interval) play()
  else pause()
})

const clearButton = document.getElementById('clear-button')
clearButton.addEventListener('click', () => {
  if (!board) return
  if (interval) pause()
  for (let i = 0; i < rows; i++) for (let j = 0; j < columns; j++) setCellFalse(board, i, j)
})
