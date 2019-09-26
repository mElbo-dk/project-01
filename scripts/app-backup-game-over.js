// setting the game board size------------------------------------------------------------------------
const width = 20
const height = 10
// timer Id's for the global scope--------------------------------------------------------------------
let timerIdShoot = null
let timerIdBomb = null
const alianIdx = 24
let shootSpeed = 100
let alianSpeed = 1000
let bombSpeed = 1000
let gameOver = 0
let gameStart = 0
let statusGame = null
let gameOverScreen = null
// setting the cells array and putting player and alian on the board -----------------------------------
const cells = []
let playerIdx = 190
const score = 0
let grid


// function for create Alians on the board--------------------------------------------------------------
function createAlians(alianIdx) {
  // create 15 alians with two row and one column between
  document.getElementById('audioSeagul').play()
  for (let i = 0; i < 15; i++) {
    cells[alianIdx].classList.add('alian')
    alian(alianIdx)
    if (i === 4 || i === 9) alianIdx += 25
    alianIdx += 3
  }
  gameStart = 0

}
// starts a new gameBoard when all alians are shut-------------------------------------------------------
function gameWin(alianIdx) {
  // alert('You are the winner')
  alianIdx = 24
  shootSpeed += 5
  alianSpeed -= 100
  bombSpeed -= 100
  // console.log(alianSpeed,bombSpeed) 
  createAlians(alianIdx)

}

//loos game and prompted Game over empty gameBoard--------------------------------------------------------
function loosGame() {
  console.log('i have been hit')
  // for (let i = 0; i < 199; i++) {
  //   if (cells[i].classList.contains('alian') === true) {
  //     cells[i].classList.remove('alian')
  //   }
  // }
  cells.forEach(cell => cell.classList.remove('alien'))
  gameOver = 1
  document.getElementById('audioGameOver').play()
  gameOverScreen = document.createElement('DIV')
  gameOverScreen.textContent = 'Game Over press \'ESC\' to play'
  gameOverScreen.classList.add('game-over')
  grid.innerHTML = ''
  grid.appendChild(gameOverScreen)
  // grid.innerHTMl = ''
  // console.log(grid)
  // const message = document.createElement('DIV')
  // message.classList.add('game-over')
  // grid.appendChild(message)
}



// reset game when lost and gameOver showing------------------------------------------------------------------
function resetGame() {
  gameOver = 0
  statusGame.textContent = 'Press \'Enter\' to start the game!'
  score.textContent = 0
  gameStart = 1
  // document.body.removeChild(gameOverScreen)
  
}


// function for chcek for Alians on the board evry time a bullet hit alian
function checkForAlians() {
  for (let i = 0; i < 199; i++) {
    if (cells[i].classList.contains('alian')) return true
  }
  return false
}

// bullet is fired 
// the return is stopping getting error when going out of the grid 
function shoot(bulletIdx) {
  if (timerIdShoot) return
  // play sound for the shooting
  document.getElementById('audioShoot').play()

  timerIdShoot = setInterval(() => {
    cells[bulletIdx].classList.remove('bullet')
    if (bulletIdx <= width) {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
    } else if (cells[bulletIdx - width].classList.value === 'alian') {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
      cells[bulletIdx - width].classList.remove('alian')
      // audio for hitting target
      document.getElementById('audioHitTarget').play()
      if (!checkForAlians(cells)) {
        gameWin(alianIdx)
      }
      
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
function alian(alianIdx) {
  // console.log('alian' + statusGame)
  const timerIdAlian = setInterval(() => {
    
    if (cells[alianIdx].classList.value !== 'alian') {
      return clearInterval(timerIdAlian)
    }
    // drops bombs if alian reach these 
    if (alianIdx >= width * 6 || alianIdx >= width * 7) {

      bombDrop(alianIdx)
    // console.log(cells[alianIdx - width].classList.value)
    }
    cells[alianIdx].classList.remove('alian')
    alianIdx += 1
    
    cells[alianIdx].classList.add('alian')

    if (cells[alianIdx].classList.value === 'player alian') {
      loosGame(alianIdx)
      // console.log('game over')

      return clearInterval(timerIdAlian)
    }
  }, alianSpeed)
}



// bombs dropping
function bombDrop(bombIdx) {
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
      loosGame(cells)
      // statusGame.textContent = 'Game Over'
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
  grid = document.querySelector('.grid')

  // // set score board value  
  const score = document.querySelector('.score')
  score.textContent = 0
  
  // text for the HTML 
  statusGame = document.querySelector('.status')
  statusGame.textContent = 'Press \'ESC\' to Reset'
  
  // create game board
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('DIV')
    grid.appendChild(cell)
    cells.push(cell)
  }
  


  // set the player on the board
  cells[playerIdx].classList.add('player')

  // controls on key down
  document.addEventListener('keydown', (e) => {

    cells[playerIdx].classList.remove('player')
    const x = playerIdx % width

    // create the alians on the board if pressed Enter
    // createAlians(cells, alianIdx, statusGame)
    switch (e.keyCode) {
      case 37: if (x > 0 && gameOver === 0) playerIdx -= 1
                  
        break
      case 39: if (x < width - 1 && gameOver === 0) playerIdx += 1
        break
      case 32: if (!gameOver) shoot(playerIdx)
        break
      case 13: if (gameStart === 1) createAlians(alianIdx)
                    
        break
      case 27: resetGame()
        console.log(e.keyCode)
        break
    }
    cells[playerIdx].classList.add('player')


  })
})
