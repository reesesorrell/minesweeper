const body = document.getElementById('body');

const scoreRow = document.getElementById('score');

const container = document.getElementById('container');

let height = 16;
let width = 30;
let numBombs = 99;

let timer = 0;

let flagCountdown = numBombs;

function makeGrid() {
    let bombList = makeBombList(numBombs); //NEEDS TO REMOVE THE ONE THAT IS ORIGINALLY CLICKED
    for (i=0; i<height; i++) { // make height number of rows
        const row = document.createElement('div');
        row.classList.add(`row`);
        container.appendChild(row); 
        for (n=0; n<width; n++) { //make column number of blocks in each row
            const block = document.createElement('button');
            block.classList.add('block');
            let blockNum = `${i}-${n}`;
            block.setAttribute('id', `${blockNum}`) // numbers the block
            for (l=0; l<bombList.length; l++) {
                if (bombList[l] === blockNum) {
                    block.classList.add('mine');
                }
            }
            block.onclick = revealBlock; //reveals the block on click
            block.oncontextmenu = markBombs;
            row.appendChild(block);
        }
    }
}

function randomInt(num) {
    return Math.floor(Math.random() * num);
}

function makeBombList(num) {
    // COME BACK AND MAKE THIS MORE EFFICIENT
    let bombLocations = [];
    for (i=0; i<num; i++) {
        let positionY = randomInt(height);
        let positionX = randomInt(width);
        let position = `${positionY}-${positionX}`;
        if (position in bombLocations) {
            i--;
        }
        else {
            bombLocations.push(position)
        }
    }
    return bombLocations;

}

function revealBlock() {
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
    else if (!this.classList.contains('revealed') && 
        !this.classList.contains('mine')) {
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

container.oncontextmenu = (e) => {
    e.preventDefault();
  }

makeTimer();

makeFlagCounter();

makeGrid();

var updateTimer = setInterval(function() {
    const timerDisplay = document.getElementById('timer');
    timer++;
    timerDisplay.innerHTML = `${timer}`;
}, 1000)