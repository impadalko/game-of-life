let columns = 0
let rows = 0
let board

const createBoard = () => {
  return Array.from(Array(rows), () => new Array(columns).fill(false))
}

const createGrid = (event) => {
  const table = document.getElementById('table')
  table.innerHTML = ''

  columns = parseInt(event.target[0].value)
  rows = parseInt(event.target[1].value)
  if (event.target[2].value) {
    document.querySelector(':root').style.setProperty('--grid-size', event.target[2].value)
  }
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
    }
  }
  event.preventDefault()
}

const gridForm = document.getElementById('grid-form')
gridForm.addEventListener('submit', createGrid)

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
  const newBoard = createBoard()
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const count = countNeighbors(i, j)
      if (count == 3) {
        newBoard[i][j] = true
        const cell = document.getElementById(`${i}-${j}`)
        cell.classList.add('selected')
      } else if (count == 2) {
        newBoard[i][j] = board[i][j]
      } else {
        newBoard[i][j] = false
        const cell = document.getElementById(`${i}-${j}`)
        cell.classList.remove('selected')
      }
    }
  }
  board = newBoard
}

const advanceButton = document.getElementById('advance-button')
advanceButton.addEventListener('click', frameAdvance)

let interval = null

const playButton = document.getElementById('play-button')
playButton.addEventListener('click', () => {
  if (!interval) {
    interval = window.setInterval(frameAdvance, 250)
    event.target.innerHTML = 'Pause'
  } else {
    window.clearInterval(interval)
    interval = null
    event.target.innerHTML = 'Play'
  }
})

const clearButton = document.getElementById('clear-button')
clearButton.addEventListener('click', () => {
  if (interval) {
    window.clearInterval(interval)
    interval = null
    playButton.innerHTML = 'Play'
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.getElementById(`${i}-${j}`)
      cell.classList.remove('selected')
    }
  }
  board = createBoard()
})
