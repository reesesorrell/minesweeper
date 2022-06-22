const body = document.getElementById('body');

const scoreRow = document.getElementById('score');

const container = document.getElementById('container');

let height = 16;
let width = 30;
let numBombs = 99;

let timer = 0;

let flagCount = 0;

function makeGrid() {
    let bombList = makeBombList(numBombs); //NEEDS TO REMOVE THE ONE THAT IS ORIGINALLY CLICKED
    for (i=0; i<height; i++) { // make height number of rows
        const row = document.createElement('div');
        row.classList.add(`row`);
        container.appendChild(row); 
        for (n=0; n<width; n++) { //make column number of blocks in each row
            const block = document.createElement('button');
            block.classList.add('block');
            let blockNum = i*width + n; //CHANGE TO A COORDINATE SYSTEM
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
        let position = randomInt(height * width);
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
        flagCount -= 1;
        flagCounter.innerHTML = `${flagCount}`;
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
    blockPosition = +block.getAttribute('id');
    for (let i=blockPosition-width; i<blockPosition+width+1; i+= width) {
        for (let n=i-1; n<i+2; n++) {
            if(n != blockPosition) {
                let current = document.getElementById(`${n}`);
                setTimeout(function() {if(current && !current.classList.contains('revealed')) {
                    current.click();
                    }
                }, 10);
            }
        }
    }
}

function checkSorroundings(block) {
    let mineNumber = 0;
    let blockPosition = block.getAttribute('id');
    let top = +blockPosition - width;
    let bottom = +blockPosition + width;
    mineNumber += checkAdjacents(top);
    mineNumber += checkAdjacents(blockPosition);
    mineNumber += checkAdjacents(bottom);
    return mineNumber;
}

function checkAdjacents(start) {
    let counter = 0
    for (i=0; i<3; i++) {
        const current = document.getElementById(+start + i - 1);
        if (current && current.classList.contains('mine')) {
            counter++;
        }
    }
    return counter;
}

function markBombs(e) {
    if (this.classList.contains('flagged')) {
        this.classList.remove('flagged');
        this.textContent = '';
        const flagCounter = document.getElementById('flag-counter');
        flagCount -= 1;
        flagCounter.innerHTML = `${flagCount}`;
    }
    else {
        this.classList.add('flagged');
        this.textContent = '|>';
        const flagCounter = document.getElementById('flag-counter');
        flagCount += 1;
        flagCounter.innerHTML = `${flagCount}`;
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
    flagCounter.innerHTML = `${flagCount}`;
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