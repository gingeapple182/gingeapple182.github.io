// p5.js library used for creating graphics and interactive experiences - more infor at https://p5js.org/
//Code created by Ness - A simple wordsearch used to teach children on the aspects of SafeSearching Online
// further enhancements made by Oliver - adjust wordsearch size, add difficulty selection, add end screen, add sounds

import { isMusicPlaying } from "./main.js";
// drawing the grid and initializing the game logic
let grid;
let gridSize = 15;
let cellSize;
let questions = [];
let answers = [];
let currentQuestionIndex = 0;
let foundAnswers = [];
let selectedCells = [];
let foundWordLines = [];
let jungleMainBg, monkey;
//oliver
let gridPadding = 50;
let difficultySelected = false;
let allowDifficultySelection = false;
let gameOver = false;
let easyRounds = 1;
let mediumRounds = 3;
let hardRounds = 5;
let currentRound = 0;
let maxRounds = 0;
let correctSound = new Audio('Assets/data/audio/correct.mp3');
let incorrectSound = new Audio('Assets/data/audio/wrong.wav');
let winSound = new Audio('Assets/data/audio/win.mp3');
let clickSound = new Audio('Assets/data/audio/click.mp3');
let finalSoundPlayed = false;


let dataReady = false;

export function loadJungleData() {
  loadJSON(
    'Assets/data/questionsJungle.json',
    (loadedQuestions) => {
      // clear existing array
      answers = [];
      questions = [];

      loadedQuestions = shuffleArray(loadedQuestions); // shuffle question bank - Oliver

      loadedQuestions.forEach(question => {
        questions.push(question);

        question.answers.forEach(answer => {
          answers.push(answer.toUpperCase());
        });
      });

      //console.log("Jungle answers:", answers);
      console.log("Jungle answers loaded in successfully.") //remove bloat in console - Oliver
      dataReady = true;
    },
    (err) => {
      console.error("Failed to load JSON data for Jungle:", err);
    }
  );
}

// Initialize the Jungle game after data is loaded
export function startJungleGame() {
  if (!dataReady) {
    console.error("Data not ready yet");
    return;
  }

  preloadJungleImages(); //load images - oliver

  if (allowDifficultySelection == false) {
    setTimeout(() => {
      console.log("Difficulty selection now enabled");
      allowDifficultySelection = true; 
    }, 500);
  }

  foundAnswers = []; // reset found words for each new question
  answers = questions[currentQuestionIndex].answers.map(answer => answer.toUpperCase());

  let maxGridHeight = height * 0.8;
  let availableHeight = min(height - (gridPadding * 2), maxGridHeight);
  cellSize = min((width * 0.8) / gridSize, availableHeight / gridSize);

  grid = makeGrid(gridSize);

  if (answers.length === 0) {
    console.error("No words to place in grid!");
    return;
  }

  console.log("Placing words into grid...");
  populateGridWithWords(grid, answers);
  fillEmpty(grid);

  console.log("Grid initialized: ", grid);
}

export function drawJungleGame() {
  //background(255); - Add in jungle background - Oliver
  if (!difficultySelected) {
    drawDifficultyPopup();
    return;
  }

  if (gameOver) {
    drawEndScreen();
    return;
  }
  
  if (jungleMainBg) {
    image(jungleMainBg, 0, 0, width, height);
  }
  if (!grid) {
    console.error("Grid not ready!");
    return;
  }

  drawGrid(grid);
  displayQuestion();
  displayAnswerList();
}

function displayAnswerList() {
  textSize(24);
  textAlign(LEFT, CENTER);

  let gridOffsetX = (width - gridSize * cellSize) / 2;
  let listX = gridOffsetX + (gridSize * cellSize) + 40; // Properly spaced from grid
  let listY = gridPadding + 140; // Align with grid

  // Box dimensions
  let boxWidth = 200; // Adjust width to fit words
  let boxHeight = answers.length * 25 + 60; // Calculate height dynamically based on answer count
  let boxX = listX - 20; // Give padding on the left
  let boxY = listY - 50; // Move up to properly contain the title

  // Draw the semi-transparent background box
  push();
  fill(255, 255, 255, 200); // Semi-transparent white
  stroke(0);
  rect(boxX, boxY, boxWidth, boxHeight, 10);
  pop();

  // Draw the title and words
  push();
  fill(0);
  noStroke();
  text("Find these words:", listX, listY - 30);

  for (let i = 0; i < answers.length; i++) {
    let word = answers[i];
    if (foundAnswers.includes(word)) {
      stroke(0);
      strokeWeight(1);
      line(listX, listY, listX + textWidth(word), listY);
    }
    noStroke();
    text(word, listX, listY);
    listY += 25;
  }
  pop(); // restore previous drawing styles
}

// functions to create grid, place words and fill empty cells
function makeGrid(size) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size).fill('');
    }
    return arr;
}

function populateGridWithWords(grid, words) {
words.forEach(word => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
        let direction = floor(random(3));
        let row = floor(random(gridSize));
        let col = floor(random(gridSize));
        placed = placeWordInGrid(grid, word, row, col, direction);
        attempts++;
    }

    if (!placed) {
        console.warn("Failed to place word:", word);
    } else {
      console.log("Placed word:", word);
    }
}); 
}

function placeWordInGrid(grid, word, row, col, direction) {
  const len = word.length;

  if (direction === 0) { // horizontal
    if (col + len > gridSize) return false;
    for (let i = 0; i < len; i++) {
      if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
    }
    for (let i = 0; i < len; i++) {
      grid[row][col + i] = word[i];
    }
  } else if (direction === 1) { // vertical
    if (row + len > gridSize) return false;
    for (let i = 0; i < len; i++) {
      if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
    }
    for (let i = 0; i < len; i++) {
      grid[row + i][col] = word[i];
    }
  } else if (direction === 2) { // diagonal
    if (row + len > gridSize || col + len > gridSize) return false;
    for (let i = 0; i < len; i++) {
      if (grid[row + i][col + i] !== '' && grid[row + i][col + i] !== word[i]) return false;
    }
    for (let i = 0; i < len; i++) {
      grid[row + i][col + i] = word[i];
    }
  }
  return true;
}
    
function fillEmpty(grid) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(floor(random(65, 91))); // ASCII A-Z
      }
    }
  }
}

function drawGrid(grid) {
  textSize(cellSize * 0.6);
  textAlign(CENTER, CENTER);

  let gridOffsetX = (width - gridSize * cellSize) / 2;
  let gridOffsetY = gridPadding + 80;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      stroke(0);
      fill(255);
      rect(gridOffsetX + j * cellSize, gridOffsetY + i * cellSize, cellSize, cellSize);
  
      fill(0);
      noStroke();
      text(grid[i][j], gridOffsetX + j * cellSize + cellSize / 2, gridOffsetY + i * cellSize + cellSize / 2);
    }
  }

  foundWordLines.forEach(({ start, end }) => {
    drawCrossOutLine(start, end);
  });

  if (selectStart && mouseIsPressed) {
    let currentPos = getGridPosition(mouseX, mouseY);
    if (currentPos) {
      drawSelectionLine(selectStart, currentPos);
    }
  }
}

function displayQuestion() {
  if (!questions[currentQuestionIndex]) return; // safety check and prevent crashes

  push(); // save current drawing styles

  let boxWidth = width * 0.6;
  let boxHeight = 60;
  let boxX = (width - boxWidth) / 2;
  let boxY = 60; 

  fill(255, 255, 255, 200); 
  stroke(0);
  rect(boxX, boxY, boxWidth, boxHeight, 10);
  fill(0); // Currently set to black text
  noStroke();
  textSize(28);
  textAlign(CENTER, CENTER);

  let questionY = 40;
  text(questions[currentQuestionIndex].question, width / 2, boxY + boxHeight / 2); // This displays the question at the top of the canvas
  pop(); // restore previous drawing styles
}

// Copied over from castle.js, adjusted to work with jungle.js - Oliver
function drawDifficultyPopup() {
  if (jungleMainBg) {
    image(jungleMainBg, 0, 0, windowWidth, windowHeight);
  }
  fill(0, 0, 0, 150); //overlay
  rect(0, 0, width, height); 

  fill(255); //difficulty popup box
  noStroke();
  rect(width/2 - 200, height/2 - 150, 400, 300, 20);
  fill(0);
  textSize(24);
  textFont('Patrick Hand');
  textStyle(NORMAL);

  textAlign(CENTER, CENTER);
  text("Select Difficulty", width/2, height/2 - 100);

  let difficulties = ["Easy", "Medium", "Hard"];
  let roundCounts = [easyRounds, mediumRounds, hardRounds];
  let descriptions = [
    "Complete " + easyRounds + " word searches to finish!", 
    "Complete " + mediumRounds + " word searches to finish!", 
    "Complete " + hardRounds + " word searches to finish!"];
  let hoveredIndex = -1;
    
  for (let i = 0; i < difficulties.length; i++) {
    let x = width / 2 - 100;
    let y = height / 2 - 50 + i * 60;
    let w = 200, h = 50;

    // Detect if mouse is over button
    let isHovered = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
    if (isHovered) hoveredIndex = i;

    // Change color on hover
    fill(isHovered ? '#cccccc' : '#ffffff');
    rect(x, y, w, h, 10);
    fill(0);
    text(difficulties[i], x + w / 2, y + h / 2);
  }
  // Show difficulty description when hovering
  if (hoveredIndex !== -1) {
    let descX = width / 2 + 220; 
    let descY = height / 2 - 50 + hoveredIndex * 60;

    fill(255);
    rect(descX, descY, 260, 60, 10);

    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    text(descriptions[hoveredIndex], descX + 10, descY + 30);
  }
}

// - oliver
function handleDifficultySelection(mouseX, mouseY) {
  let difficulties = ["Easy", "Medium", "Hard"];
  let roundLimits = [easyRounds, mediumRounds, hardRounds]; // Word search rounds for each difficulty

  for (let i = 0; i < difficulties.length; i++) {
    let x = width / 2 - 100;
    let y = height / 2 - 50 + i * 60;
    let w = 200, h = 50;

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      // Set word search rounds
      maxRounds = roundLimits[i];
      currentRound = 0; // Reset round count

      difficultySelected = true;
      console.log(`Difficulty selected: ${difficulties[i]} (${maxRounds} rounds)`);

      if (isMusicPlaying) {
        clickSound.currentTime = 0;
        clickSound.play();
      }

      // Start the first word search
      startJungleGame();
      return;
    }
  }
}
// - oliver
function drawEndScreen() {
  if (jungleMainBg) {
    image(jungleMainBg, 0, 0, windowWidth, windowHeight);
  }
  if (!finalSoundPlayed) {
    if (isMusicPlaying) {
      winSound.currentTime = 0;
      winSound.play();
      finalSoundPlayed = true;
    }
  }
  fill(0, 0, 0, 150); // Semi-transparent overlay
  rect(0, 0, width, height);

  fill(255); // End screen box
  noStroke();
  rect(width / 2 - 200, height / 2 - 150, 400, 200, 20);
  
  fill(0);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Congratulations!", width / 2, height / 2 - 50);

  // Restart Button (non-functional for now)
  fill(255);
  rect(40, height - 70, 150, 50, 10);
  fill(0);
  textSize(24);
  textAlign(LEFT, CENTER);
  text("Restart", 60, height - 45);
}

// - oliver
export function resetJungleGame() {
  console.log("Resetting Jungle Game...");

  // Reset game state
  difficultySelected = false;
  gameOver = false;
  currentRound = 0;
  maxRounds = 0;
  finalSoundPlayed = false;

  // Clear selections
  foundWordLines = [];
  foundAnswers = [];
  selectedCells = [];
  selectStart = null;
  selectEnd = null;

  if (isMusicPlaying) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
  // Re-enable difficulty selection after short delay
  allowDifficultySelection = false;
  setTimeout(() => {
    allowDifficultySelection = true;
  }, 500);
}

// functionality to select words in the grid - mouse handling
let selectStart = null;
let selectEnd = null;

export function jungleMousePressed() {
  if (!difficultySelected) {
    handleDifficultySelection(mouseX, mouseY);
    return;
  }

  if (gameOver) {
    let restartX = 40, restartY = height - 70, restartW = 150, restartH = 50;
    if (mouseX > restartX && mouseX < restartX + restartW &&
        mouseY > restartY && mouseY < restartY + restartH) {
      resetJungleGame();
    }
    return;
  }

  selectStart = getGridPosition(mouseX, mouseY);
  selectedCells = [];
  console.log("selectedStart:", selectStart);
}

export function jungleMouseReleased() {
  if (!difficultySelected) {
    console.log("Mouse release ignored - Difficulty not selected yet.");
    return;
  }

  selectEnd = getGridPosition(mouseX, mouseY);
  checkSelection();
}

function getGridPosition(x, y) {
  let gridOffsetX = (width - gridSize * cellSize) / 2;
  let gridOffsetY = gridPadding + 80;

  let col = Math.floor((x - gridOffsetX) / cellSize);
  let row = Math.floor((y - gridOffsetY) / cellSize);

  if (col < 0 || col >= gridSize || row < 0 || row >= gridSize) {
    return null;
  }

  return {col, row};
}

// checking selection against the correct answer
function checkSelection() {
  if (!selectStart || !selectEnd) return;

  const selectedWord = extractWordFromGrid(selectStart, selectEnd);
  console.log("Selected Word:", selectedWord);

  const isCorrect = answers.includes(selectedWord.toUpperCase());

  if (isCorrect && !foundAnswers.includes(selectedWord.toUpperCase())) {
    foundAnswers.push(selectedWord.toUpperCase()); // Mark as found

    // Store highlighted positions
    foundWordLines.push({ start: selectStart, end: selectEnd });
    console.log("Correct! Keeping selection highlighted.");
    if (isMusicPlaying) {
      correctSound.currentTime = 0;
      correctSound.play();
    }
  } else {
    console.log("Incorrect! Selection cleared.");
    selectedCells = [];
    if (isMusicPlaying) {
      incorrectSound.currentTime = 0;
      incorrectSound.play();
    }
  }

  if (foundAnswers.length === answers.length) {
      console.log("All words found!");
      advanceToNextQuestion();
  }
}


function drawCrossOutLine(start, end) {
  let gridOffsetX = (width - gridSize * cellSize) / 2;
  let gridOffsetY = gridPadding + 80;

  let x1 = gridOffsetX + start.col * cellSize + cellSize / 2;
  let y1 = gridOffsetY + start.row * cellSize + cellSize / 2;
  let x2 = gridOffsetX + end.col * cellSize + cellSize / 2;
  let y2 = gridOffsetY + end.row * cellSize + cellSize / 2;


  push(); // save current drawing styles
  stroke(124, 252, 0); // lawn green in p5
  strokeWeight(4);
  line(x1, y1, x2, y2);
  pop(); // restore previous drawing styles
}

function drawSelectionLine(start, end) {
  let gridOffsetX = (width - gridSize * cellSize) / 2;
  let gridOffsetY = gridPadding + 80;

  let x1 = gridOffsetX + start.col * cellSize + cellSize / 2;
  let y1 = gridOffsetY + start.row * cellSize + cellSize / 2;
  let x2 = gridOffsetX + end.col * cellSize + cellSize / 2;
  let y2 = gridOffsetY + end.row * cellSize + cellSize / 2;

  push();
  stroke(124, 252, 0);
  strokeWeight(6);
  line(x1, y1, x2, y2);
  pop(0);
}

function extractWordFromGrid(start, end) {
  if (!start || !end) return "";

  let word = "";

  if (start.row === end.row) {
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
    for (let col = minCol; col <= maxCol; col++) {
      word += grid[start.row][col];
    }
    console.log("Extracted horizontal word:", word);
    return word;
  }

  if (start.col === end.col) {
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    for (let row = minRow; row <= maxRow; row++) {
      word += grid[row][start.col];
    }
    console.log("Extracted vertical word:", word);
    return word;
  }

  let rowDiff = end.row - start.row;
  let colDiff = end.col - start.col;

  if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    let stepRow = rowDiff > 0 ? 1 : -1;
    let stepCol = colDiff > 0 ? 1 : -1;
    let currentRow = start.row;
    let currentCol = start.col;

    for (let i = 0; i <= Math.abs(rowDiff); i++) {
      word += grid[currentRow][currentCol];
      currentRow += stepRow;
      currentCol += stepCol;
    }
    console.log("Extracted diagonal word:", word);
    return word;
  }

  console.log("Failed to extract word from grid!");
  return "";
}

  // Next Question Functionality
function advanceToNextQuestion() {
  // currentQuestionIndex++;
  // if (currentQuestionIndex >= questions.length) {
  //   console.log("Complete all questions!");
  //   currentQuestionIndex = 0; // reset to first question if all questions are completed
  // }
  currentQuestionIndex++;
  currentRound++;

  if (currentRound >= maxRounds) {
    console.log("All rounds completed! Showing end screen.");
    gameOver = true;
    return;
  }

  console.log(`Starting round ${currentRound + 1}/${maxRounds}`);
  foundWordLines = []; // clear previous lines
  foundAnswers = []; // reset found answers
  selectedCells = []; // clear selected cells
  selectStart = null;
  selectEnd= null;

  startJungleGame();
}

function preloadJungleImages() { // load in jungle images - Oliver
  console.log("Preloading jungle images...");
  jungleMainBg = loadImage("Assets/data/jungle/jungleBg.svg");
  monkey = loadImage("Assets/data/jungle/monkey.svg");
}

function shuffleArray(array) { // shuffle questions - Oliver
  let shuffled = array.slice(); // Copy the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}
