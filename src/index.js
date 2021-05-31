let columns = 0
let rows = 0

function logSubmit(event) {
  const table = document.getElementById('table')
  table.innerHTML = ''

  columns = parseInt(event.target[0].value)
  rows = parseInt(event.target[1].value)
  for (let i = 0; i < columns; i++) {
    const row = table.insertRow()
    for (let j = 0; j < rows; j++) {
      const cell = row.insertCell()
      cell.addEventListener('click', () => {
        console.log(`${i}-${j}`)
      })
      cell.innerHTML = `${i}-${j}`
    }
  }
  event.preventDefault()
}

const form = document.getElementById('form')
form.addEventListener('submit', logSubmit)
