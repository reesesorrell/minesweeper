const body = document.getElementById('body');

const scoreRow = document.getElementById('score');

const container = document.getElementById('container');

let height = 16;
let width = 30;
let numBombs = 99;

let timer = 0;

let flagCountdown = numBombs;

let beginning = true;

function makeGrid() {
     //NEEDS TO REMOVE THE ONE THAT IS ORIGINALLY CLICKED
    for (i=0; i<height; i++) { // make height number of rows
        const row = document.createElement('div');
        row.classList.add(`row`);
        container.appendChild(row); 
        for (n=0; n<width; n++) { //make column number of blocks in each row
            const block = document.createElement('button');
            block.classList.add('block');
            let blockNum = `${i}-${n}`;
            block.setAttribute('id', `${blockNum}`) // numbers the block
            block.onclick = revealBlock; //reveals the block on click
            block.oncontextmenu = markBombs;
            row.appendChild(block);
        }
    }
}

function randomInt(num) {
    return Math.floor(Math.random() * num);
}

function makeBombList(num, start) {
    let bombLocations = [];
    console.log(start)
    let startCoordinates = start.split('-');
    let emptyX = randomInt(1) + 1
    let emptyY = randomInt(1) + 1
    let negativeEmptyX = emptyX * -1
    let negativeEmptyY = emptyY * -1
    safeSquares = []
    for (y=negativeEmptyY; y<=emptyY; y++) {
        for (x=negativeEmptyX; x<=emptyX; x++) {
            let newY = +startCoordinates[0] + y;
            let newX = +startCoordinates[1] + x;
            newCoordinates = `${newY}-${newX}`;
            safeSquares.push(newCoordinates)
        }
    }
    let bombsAdded = 0;
    for (i=0; i<num; i++) {
        let positionY = randomInt(height);
        let positionX = randomInt(width);
        let position = `${positionY}-${positionX}`;
        if (bombLocations.includes(position)) {
            i--;
            //console.log('already a bomb');
        }
        else if (safeSquares.includes(position)) {
            i--;
            //console.log(`${position} is a safesquare`);
        }
        else {
            bombLocations.push(position);
            bombsAdded += 1
        }
    }
    console.log(bombsAdded)
    return bombLocations;

}

function revealBlock() {
    if (beginning) {
        initialClick = this.id
        let bombList = makeBombList(numBombs, initialClick);
        for (i=0; i<height; i++) {
            for (n=0; n<width; n++) {
                let blockNum = `${i}-${n}`;
                for (l=0; l<bombList.length; l++) {
                    if (bombList[l] === blockNum) {
                        let block = document.getElementById(blockNum)
                        block.classList.add('mine');
                    }
                }
            }
        }
        beginning = false;   
    }
    if (this.classList.contains('flagged')) {
        this.classList.remove('flagged');
        this.textContent = '';
        const flagCounter = document.getElementById('flag-counter');
        flagCountdown += 1;
        flagCounter.innerHTML = `${flagCountdown}`;
    }
    else {
        this.classList.add('revealed');
        if (this.classList.contains('mine')) {
            this.textContent = 'X'; // adds an X if there is a mine
            this.style.backgroundColor = 'brown';
            this.style.color = 'white';
            timer.sleep
            sleep(500).then(() => {
                alert('You have lost. Im sorry. Try again by pressing the button below.');
                document.location.reload(true);
            });
        }
        else {
            let sorroundings = checkSorroundings(this);
            this.textContent = sorroundings;
            this.style.backgroundColor = 'beige';
            this.style.color = 'grey';
            if (sorroundings == 0) {
                revealAdjacents(this);
            }
        }
    }
}

function revealAdjacents(block) {
    let blockPosition = block.getAttribute('id').split('-');
    let blockY = blockPosition[0];
    let blockX = blockPosition[1];
    for (let i = 0; i<3; i++) {
        let currentY = blockY - 1 + i;
        for (let n=0; n<3; n++) {
            let currentX = blockX - 1 + n;
            let currentCoords = `${currentY}-${currentX}`;
            let current = document.getElementById(currentCoords);
            setTimeout(function() {if(current != block && 
                current && !current.classList.contains('revealed')) {
                current.click();
                }
            }, 10);
        }
    }
}

function checkSorroundings(block) {
    let mineNumber = 0;
    let blockPosition = block.getAttribute('id').split('-');
    let blockY = blockPosition[0];
    let blockX = blockPosition[1];
    for (let i = 0; i<3; i++) {
        let currentY = blockY - 1 + i;
        for (let n=0; n<3; n++) {
            let currentX = blockX - 1 + n;
            let currentCoords = `${currentY}-${currentX}`;
            let current = document.getElementById(currentCoords);
            if (current && current.classList.contains('mine')) {
                mineNumber++;
            }
        }
    }
    return mineNumber;
}

function markBombs(e) {
    if (this.classList.contains('flagged')) {
        this.classList.remove('flagged');
        this.textContent = '';
        const flagCounter = document.getElementById('flag-counter');
        flagCountdown += 1;
        flagCounter.innerHTML = `${flagCountdown}`;
    }
    else if (!this.classList.contains('revealed')) {
        this.classList.add('flagged');
        this.textContent = '|>';
        const flagCounter = document.getElementById('flag-counter');
        flagCountdown -= 1;
        flagCounter.innerHTML = `${flagCountdown}`;
    }
}

function makeTimer() {
    const timerDisplay = document.createElement('div');
    timerDisplay.setAttribute('id', 'timer');
    scoreRow.appendChild(timerDisplay);
    timerDisplay.innerHTML = `${timer}`;
}

function makeFlagCounter() {
    const flagCounter = document.createElement('div');
    flagCounter.setAttribute('id', 'flag-counter');
    scoreRow.appendChild(flagCounter);
    flagCounter.innerHTML = `${flagCountdown}`;
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

container.oncontextmenu = (e) => {
    e.preventDefault();
  }

function startGame() {
    makeTimer();

    makeFlagCounter();

    makeGrid();

    var updateTimer = setInterval(function() {
        if (!beginning) {
            const timerDisplay = document.getElementById('timer');
            timer++;
            timerDisplay.innerHTML = `${timer}`;
        }
    }, 1000)
}

startGame();