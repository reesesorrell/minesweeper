const body = document.getElementById('body');

const scoreRow = document.getElementById('score');

const container = document.getElementById('container');

let height = 16;
let width = 30;
let numBombs = 99;

let timer = 0;

function makeGrid() {
    let bombList = makeBombList(numBombs); //NEEDS TO REMOVE THE ONE THAT IS ORIGINALLY CLICKED
    for (i=0; i<height; i++) { // make height number of rows
        const row = document.createElement('div');
        row.classList.add(`row`);
        container.appendChild(row); 
        for (n=0; n<width; n++) { //make column number of blocks in each row
            const block = document.createElement('button');
            block.classList.add('block');
            let blockNum = i*width + n;
            block.setAttribute('id', `${blockNum}`) // numbers the block
            for (l=0; l<bombList.length; l++) {
                if (bombList[l] === blockNum) {
                    block.classList.add('mine');
                }
            }
            block.onclick = revealBlock; //reveals the block on click
            block.onkeydown = markBombs;
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
        if (sorroundings == 0) {
            revealAdjacents(this);
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
                    console.log(n);
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
    if (e.which === 32) {
        console.log(this);
        this.textContent = '|>';
    }
}

function makeTimer() {
    const timerDisplay = document.createElement('div');
    timerDisplay.setAttribute('id', 'timer');
    scoreRow.appendChild(timerDisplay);
    timerDisplay.innerHTML = `${timer}`;
}

makeTimer();

makeGrid();

var updateTimer = setInterval(function() {
    const timerDisplay = document.getElementById('timer');
    timer++;
    timerDisplay.innerHTML = `${timer}`;
}, 1000)