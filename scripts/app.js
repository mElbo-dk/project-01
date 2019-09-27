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
let gameOver = false
let gameStart = true
let statusGame = null
let loosgameCounter = 3
let lives = 0
let noSound = 1



// setting the cells array and putting player and alian on the board -----------------------------------
const cells = []
let playerIdx = 190
let score = 0
let grid = null


// function for create Alians on the board--------------------------------------------------------------
function createAlians(alianIdx) {
  // create 15 alians with two row and one column between
  if (checkForAlians(cells)) {
    console.log('aliancheck')
    return
  }
  playSound('audioReloadGame')
  statusGame.textContent = ' \'a\' to turn on sound, \'s\' to turn off sound'
  for (let i = 0; i < 15; i++) {
    cells[alianIdx].classList.add('alian')
    alian(alianIdx)
    if (i === 4 || i === 9) alianIdx += 25
    alianIdx += 3
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


// starts a new gameBoard when all alians are shut-------------------------------------------------------
function gameWin(alianIdx) {
  
  // alert('You are the winner')
  alianIdx = 24
  shootSpeed += 5
  alianSpeed -= 100
  bombSpeed -= 100
  createAlians(alianIdx)
  
}

// function for chcek for Alians on the board evry time a bullet hit alian----------------------------------
function checkForAlians() {
  for (let i = 0; i < 199; i++) {
    if (cells[i].classList.contains('alian')) return true
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
      if (cells[i].classList.contains('alian') === true) {
        cells[i].classList.remove('alian')
      }
    }
    
    lives.textContent =  0 + ' lives'  
    gameOver = true
    playSound('audioGameOver')
    statusGame.textContent = 'Game Over press \'Enter\'to start playing!'
    shootSpeed = 100
    alianSpeed = 1000
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
    } else if (cells[bulletIdx - width].classList.value === 'alian') {
      clearInterval(timerIdShoot)
      timerIdShoot = 0
      cells[bulletIdx - width].classList.remove('alian')
      // audio for hitting target
      playSound('audioHitTarget')
      if (!checkForAlians(cells)) {
        gameWin(alianIdx)
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
function alian(alianIdx) {
  const timerIdAlian = setInterval(() => {
    //console.log('alian' + timerIdAlian)
    if (cells[alianIdx].classList.value !== 'alian') {
      return clearInterval(timerIdAlian)
    }
    // drops bombs if alian reach these 
    if (alianIdx >= width * 6 || alianIdx >= width * 7) {
      bombDrop(alianIdx + 2)
    }
    cells[alianIdx].classList.remove('alian')
    alianIdx += 1
    cells[alianIdx].classList.add('alian')

    if (cells[alianIdx].classList.value === 'player alian') {
      loosGame(alianIdx)
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

    // create the alians on the board if pressed Enter
    // createAlians(cells, alianIdx, statusGame)
    switch (e.keyCode) {
      case 37: if (x > 0 && gameOver === false) playerIdx -= 1
        break
      case 39: if (x < width - 1 && gameOver === false) playerIdx += 1
        break
      case 32: if (!gameOver) shoot(playerIdx)
        break
      case 13: if (gameStart === true) createAlians(alianIdx)
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
