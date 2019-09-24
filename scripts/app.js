// setting the game board size


const width = 20
const height = 10
let timerIdShoot = null
let timerIdBomb  = null
const alianIdx = 24
let shootSpeed = 100
let alianSpeed = 1000
let bombSpeed = 1000

// function for create Alians on the board
function createAlians(cells, alianIdx, statusGame) {
  // create 15 alians with two row and one column between
  for (let i = 0; i < 15; i++) {
    cells[alianIdx].classList.add('alian')
    alian(cells, alianIdx, statusGame)
    if (i === 4 || i === 9) alianIdx += 25
    alianIdx += 3
  }
}

function gameWin(cells,alianIdx ,statusGame ) {
  // alert('You are the winner')
  alianIdx = 24
  shootSpeed += 5
  alianSpeed -= 100
  bombSpeed -=  100
  console.log(alianSpeed,bombSpeed) 
  createAlians(cells, alianIdx, statusGame)

}


// function for chcek for Alians on the board
function checkForAlians(cells) {  
  for (let i = 0; i < 199; i++) {
    if (cells[i].classList.contains('alian')) return true
  }
  return false
}

// bullet is fired 
// the return is stopping getting error when going out of the grid 
function shoot(cells, bulletIdx, score , statusGame) {
  if (timerIdShoot) return
  timerIdShoot = setInterval(() => {
    cells[bulletIdx].classList.remove('bullet')
    if (bulletIdx <= width) {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
    } else if (cells[bulletIdx - width].classList.value === 'alian') {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
      cells[bulletIdx - width].classList.remove('alian')
      if (!checkForAlians(cells)) {

        gameWin(cells,alianIdx,statusGame)
      }
      console.log('shoot')
      // adding scorepoints to the HTML
      const newScore = parseInt(score.textContent)
      score.textContent = newScore + bulletIdx
    } else {
      bulletIdx -= width
      cells[bulletIdx].classList.add('bullet')
    }
  }, shootSpeed)
}

// alien to be moving right 
function alian(cells, alianIdx, statusGame) {
  const timerIdAlian = setInterval(() => {
    if (cells[alianIdx].classList.value !== 'alian') {
      return clearInterval(timerIdAlian)
    }
    // drops bombs if alian reach these 
    if (alianIdx >= width * 6  || alianIdx >= width * 7) {

      bombDrop(cells, alianIdx + 2 ,statusGame)
      // console.log(cells[alianIdx - width].classList.value)
    }
    cells[alianIdx].classList.remove('alian')
    alianIdx += 1
    cells[alianIdx].classList.add('alian')
    if (cells[alianIdx].classList.value === 'player alian') {
      statusGame.textContent = 'Game Over'
      return clearInterval(timerIdAlian)
    }
  }, alianSpeed)
}




// bombs dropping
function bombDrop(cells, bombIdx,statusGame) {
  if (timerIdBomb) return
  timerIdBomb = setInterval(() => {
    cells[bombIdx].classList.remove('bomb')
    if (bombIdx >= width * 9) {
      // console.log(bombIdx)
      clearInterval(timerIdBomb)
      timerIdBomb = 0
    } else if (cells[bombIdx + width].classList.value === 'player') {
      // console.log('bomb')
      clearInterval(timerIdBomb)
      timerIdBomb = 0
      // adding game Over to the HTML
      statusGame.textContent = 'Game Over'
      cells[bombIdx - width].classList.remove('player')
    } else {
      // console.log(bombIdx)
      bombIdx += width
      cells[bombIdx].classList.add('bomb')
    }
  }, bombSpeed)
}


// DOM is loaded
// Declare variables for DOM
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')

  // set score board value  
  const score = document.querySelector('.score')
  score.textContent = 0
  // text for the HTML 
  const statusGame = document.querySelector('.status')
  statusGame.textContent = 'playing'


  // setting the cells array and putting player and alian on the board 
  const cells = []
  let playerIdx = 190
  
  // create game board
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('DIV')
    grid.appendChild(cell)
    cells.push(cell)
  }

  // }
  // set the player on the board
  cells[playerIdx].classList.add('player')

  // controls on key down
  document.addEventListener('keydown', (e) => {

    cells[playerIdx].classList.remove('player')
    const x = playerIdx % width

    // create the alians on the board if pressed Enter
    // createAlians(cells, alianIdx, statusGame)
    switch (e.keyCode) {
      case 37: if (x > 0) playerIdx -= 1
        break
      case 39: if (x < width - 1) playerIdx += 1
        break
      case 32: shoot(cells, playerIdx, score)
        break
      case 13: createAlians(cells, alianIdx, statusGame)
        break
      case 27: 
        console.log(e.keyCode)
        break
    }
    cells[playerIdx].classList.add('player')


  })
})
