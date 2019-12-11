// setting the game board size------------------------------------------------------------------------
const width = 20
const height = 10

// timer Id's for the global scope--------------------------------------------------------------------
let timerIdShoot = null
let timerIdBomb = null
const alienIdx = 24
let shootSpeed = 100
let alienSpeed = 1000
let bombSpeed = 1000
let gameOver = false
let gameStart = true
let statusGame = null
let loosgameCounter = 3
let lives = 0
let noSound = 1



// setting the cells array and putting player and alien on the board -----------------------------------
const cells = []
let playerIdx = 190
let score = 0
let grid = null


// function for create aliens on the board--------------------------------------------------------------
function createaliens(alienIdx) {
  // create 15 aliens with two row and one column between
  if (checkForaliens(cells)) {
    console.log('aliencheck')
    return
  }
  playSound('audioReloadGame')
  statusGame.textContent = ' \'s\' to turn on sound, \'a\' to turn off sound'
  for (let i = 0; i < 15; i++) {
    cells[alienIdx].classList.add('alien')
    alien(alienIdx)
    if (i === 4 || i === 9) alienIdx += 25
    alienIdx += 3
  }
  loosgameCounter = 3
  if (gameOver === true){
    score.textContent = 0 + ' Points '
  }
  
  gameOver = false
  gameStart = false
  lives.textContent =  `${loosgameCounter} Lives`
  
}


// Function to play sounds-------------------------------------------------------------------------------
function playSound(sound) {
  if (noSound === false) {
    return
  } else {
    document.getElementById(sound).play()
  }
  
}


// starts a new gameBoard when all aliens are shut-------------------------------------------------------
function gameWin(alienIdx) {
  
  // alert('You are the winner')
  alienIdx = 24
  shootSpeed += 5
  alienSpeed -= 100
  bombSpeed -= 100
  createaliens(alienIdx)
  
}

// function for check for aliens on the board evry time a bullet hit alien----------------------------------
function checkForaliens() {
  for (let i = 0; i < 199; i++) {
    if (cells[i].classList.contains('alien')) return true
  }
  return false
}


//loos game and prompted Game over  + empty gameBoard--------------------------------------------------------
function loosGame() {
  if (loosgameCounter > 1) {
    loosgameCounter = loosgameCounter - 1
    lives.textContent =  loosgameCounter + ' lives'
  } else {
    for (let i = 0; i < 199; i++) {
      if (cells[i].classList.contains('alien') === true) {
        cells[i].classList.remove('alien')
      }
    }
    
    lives.textContent =  0 + ' lives'  
    gameOver = true
    playSound('audioGameOver')
    statusGame.textContent = 'Game Over press \'Enter\'to start playing!'
    shootSpeed = 100
    alienSpeed = 1000
    bombSpeed = 1000
    
    
  }
  gameStart = true
}







// bullet fired 
function shoot(bulletIdx) {
  if (timerIdShoot) return
  // play sound for the shooting
  playSound('audioShoot')
  timerIdShoot = setInterval(() => {
    cells[bulletIdx].classList.remove('bullet')
    if (bulletIdx <= width) {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
    } else if (cells[bulletIdx - width].classList.value === 'alien') {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
      cells[bulletIdx - width].classList.remove('alien')
      // audio for hitting target
      playSound('audioHitTarget')
      if (!checkForaliens(cells)) {
        gameWin(alienIdx)
      }
      // adding scorepoints to the HTML
      const newScore = parseInt(score.textContent)
      score.textContent = newScore + bulletIdx + ' Points '
    } else {
      bulletIdx -= width
      cells[bulletIdx].classList.add('bullet')
    }
  }, shootSpeed)
}

// alien to be moving right 
function alien(alienIdx) {
  const timerIdalien = setInterval(() => {
    //console.log('alien' + timerIdalien)
    if (cells[alienIdx].classList.value !== 'alien') {
      cells[alienIdx].classList.remove('alien')
      return clearInterval(timerIdalien)
    }
    // drops bombs if alien reach these 
    if (alienIdx >= width * 6 || alienIdx >= width * 7) {
      bombDrop(alienIdx + 2)
    }
    cells[alienIdx].classList.remove('alien')
    alienIdx += 1
    cells[alienIdx].classList.add('alien')

    if (cells[alienIdx].classList.value === 'player alien') {
      console.log(cells[alienIdx].classList.value)
      
      cells[alienIdx].classList.remove('alien')
      loosGame(alienIdx)
      return clearInterval(timerIdalien)
    }
  }, alienSpeed)
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
      playSound('audioBumbDrop')
      clearInterval(timerIdBomb)
      timerIdBomb = 0
      // adding game Over to the HTML
      loosGame(cells)
      // statusGame.textContent = 'Game Over'
      cells[bombIdx - width].classList.remove('player')
    } else {
      bombIdx += width
      cells[bombIdx].classList.add('bomb')
      
    }
  }, bombSpeed)
}

// ---------------------------------------------------------------------------------------------------------------
// DOM is loaded
// Declare variables for DOM
document.addEventListener('DOMContentLoaded', () => {
  grid = document.querySelector('.grid')

  // // set score board value  
  score = document.querySelector('.score')
  score.textContent = 0 + ' Points'

  // text for the HTML 
  statusGame = document.querySelector('.status')
  statusGame.textContent = 'Press \'Enter\' to Start'
  
  // lives for the HTML 
  lives = document.querySelector('.lives')
  lives.textContent =  loosgameCounter + ' lives'

  // create game board
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('DIV')
    grid.appendChild(cell)
    cells.push(cell)
  }



  // set the player on the board
  cells[playerIdx].classList.add('player')

  // controls on key down -----------------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {

    cells[playerIdx].classList.remove('player')
    const x = playerIdx % width

    // create the aliens on the board if pressed Enter
    // createaliens(cells, alienIdx, statusGame)
    switch (e.keyCode) {
      case 37: if (x > 0 && gameOver === false) playerIdx -= 1
        break
      case 39: if (x < width - 1 && gameOver === false) playerIdx += 1
        break
      case 32: if (!gameOver) shoot(playerIdx)
        break
      case 13: if (gameStart === true) createaliens(alienIdx)
        break
      case 83: noSound = true // sound off with s
        break
      case 65: noSound = false // sound off with a
        break
    }
    cells[playerIdx].classList.add('player')

    console.log('bom' + bombSpeed)
  })
  console.log('nosound ' + noSound)
})
