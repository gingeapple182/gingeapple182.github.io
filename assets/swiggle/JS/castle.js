// Oliver - Castle Quiz Implementation

import { gameState } from "./gamestate.js";
import { scrollingBackground, isMusicPlaying } from "./main.js";

let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let questionLoaded = false;
let correctAnswers = 0; //castle strength
let incorrectAnswers = 0; //invader strength
let endResult;
let userAnswers = [];
let quizCompleted = false;
let quizLength = 0;
let difficultySelected = false;
let allowDifficultySelection = false;
let invaders = [];
let currentPage = 0;
const questionsPerPage = 3;
let nextPageButton, prevPageButton;
let castleMainBg, castleMainFg, castleRubble, clouds, knight;
let easyDifficulty = 5;
let mediumDifficulty = 10;
let hardDifficulty = 15;
let answerMessage = "Answer correctly and build your defences!"; let messageVisible = true;
const incorrectMessages = [
    "The invaders grow stronger!",
    "Your defences are weakening!",
    "That wasn’t the right tactic!",
    "The enemy advances—be careful!",
    "Your castle is under threat!",
    "That choice left your walls vulnerable!",
    "Think carefully—your kingdom depends on it!",
    "The invaders won’t wait forever!",
    "Your walls are cracking under pressure!",
    "The enemy gains strength!",
    "That didn’t stop them—try again!",
    "Your castle needs a stronger defence!",
    "The siege continues—stay sharp!",
    "That answer didn’t hold them back!",
    "Your strategy needs adjusting!",
    "Reinforce your knowledge, soldier!",
    "Think again—your castle's safety is at stake!",
    "The enemy's forces push forward!",
    "You must hold the line—reconsider!",
    "The walls won’t hold much longer!"
];
const correctMessages = [
    "Your castle stands stronger!",
    "The invaders are pushed back!",
    "Excellent defence!",
    "Your walls are holding firm!",
    "Your strategy is working!",
    "Great job! The castle is fortified!",
    "Brilliant! The enemy is retreating!",
    "Your kingdom is safer now!",
    "The walls grow taller and stronger!",
    "Keep going—you're defending well!",
    "You’ve reinforced the castle!",
    "The invaders hesitate—well done!",
    "Your wisdom strengthens the fortress!",
    "The castle stands firm thanks to you!",
    "Victory is within reach!",
    "Your knowledge is your greatest weapon!",
    "You’ve secured another layer of defence!",
    "Your castle’s defences are holding strong!",
    "Well done! The enemy is faltering!",
    "Your kingdom is proud of your wisdom!"
];
// Sound effects
let correctSound = new Audio('Assets/data/audio/correct.mp3');
let incorrectSound = new Audio('Assets/data/audio/wrong.wav');
let winSound = new Audio('Assets/data/audio/win.mp3');
let loseSound = new Audio('Assets/data/audio/lose.wav');
let clickSound = new Audio('Assets/data/audio/click.mp3');
let finalSoundPlayed = false;


export function startCastleGame() {
    console.log("startCastleGame() called.");
    preloadCastleImages();
    clear();
    resetCastleGame();
    difficultySelected = false;
    invaders = [];
    setTimeout(() => {
        console.log("Difficulty selection now enabled");
        allowDifficultySelection = true; 
    }, 500);
}

// Function to reset game variables
export function resetCastleGame() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentQuestionIndex = 0;
    quizCompleted = false;
    selectedAnswer = null;
    difficultySelected = false;
    allowDifficultySelection = false;
    removePaginationButtons();
    console.log("Castle game variables reset");
}

export function drawCastleGame() {
    if (!difficultySelected) {
        drawDifficultyPopup();
        return;
    }

    if (!questionLoaded) {
        fill(0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Loading Questions...", width / 2, height / 2);
        return;
    }
    
    if (quizCompleted) {
        drawEndScreenLeft();
        drawEndScreenRight();
        return;
    }

    if (castleMainBg && castleMainFg) {
        image(castleMainBg, 0, 0, width, height);
        scrollingBackground();
        image(castleMainFg, 0, 0, width, height);
    }

    drawCastleWall();
    drawInvaders();

    
    let boxWidth = width * 0.5; 
    let boxHeight = 400; 
    let boxX = (width - boxWidth) / 2; 
    let boxY = 150; 

    fill(255, 255, 255, 180); 
    stroke(0); 
    rect(boxX, boxY, boxWidth, boxHeight, 10); 
    let question = questions[currentQuestionIndex];

    // Display question
    fill(0);
    textSize(20);
    textFont('Patrick Hand');
    textStyle(NORMAL);
    textAlign(CENTER);
    let questionLines = breakTextLines(question.question, boxWidth - 40);
    questionLines.forEach((line, index) => {
        text(line, width / 2, 200 + (index * 24));
    });

    // Display answer options
    let yPosition = 300;
    question.options.forEach((option, index) => {
        let buttonWidth = 400;
        let buttonHeight = 50;
        let x = width / 2 - 200;
        let y = yPosition;

        fill(selectedAnswer === index ? "gray" : "white");
        stroke(0);
        rect(x, y, buttonWidth, buttonHeight, 10);

        fill(0);
        textAlign(CENTER, CENTER);
        let optionLines = breakTextLines(option, buttonWidth - 20);
        optionLines.forEach((line, lineIndex) => {
            text(line, x + buttonWidth / 2, y + 20 + (lineIndex * 20));
        });

        yPosition += 60;
    });

    drawAnswerMessage();
}

function drawDifficultyPopup() {
    if (castleMainBg && castleMainFg && clouds) {
          image(castleMainBg, 0, 0, windowWidth, windowHeight);
          scrollingBackground();
          image(castleMainFg, 0, 0, windowWidth, windowHeight);
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
    let descriptions = [
        "You must answer " + easyDifficulty + " questions", 
        "You must answer " + mediumDifficulty + " questions", 
        "You must answer " + hardDifficulty + " questions"];
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
        rect(descX, descY, 220, 60, 10);

        fill(0);
        textSize(18);
        textAlign(LEFT, CENTER);
        text(descriptions[hoveredIndex], descX + 10, descY + 30);
    }
}

function drawEndScreenLeft() {    
    clear();
    background(240);
    
    endResult = correctAnswers - incorrectAnswers;
    
    if (castleMainBg && castleMainFg) {
        image(castleMainBg, 0, 0, width, height);
        scrollingBackground();
        image(castleMainFg, 0, 0, width, height);
    }
    drawCastleWall();

    // Play the final sound only once when the end screen is first drawn
    if (!finalSoundPlayed) {
        if (endResult > 0) {
            if (isMusicPlaying) {
                winSound.currentTime = 0;
                winSound.play();
            } 
        } else if (endResult < 0) {
            if (isMusicPlaying) {
                loseSound.currentTime = 0;
                loseSound.play();
            }
        }
        // If it's a draw, you could choose to play neither or add another sound.
        finalSoundPlayed = true;
    }
    // show invaders on defeated castle
    if (endResult < 0) {

        image(castleRubble, 0, 0, width, height);
        invaders.length = 0; // clear old invaders
        let blockWidth = width / 10;
        let blockHeight = (height * 0.8) / quizLength;
        let blockX = width / 10;
        let blockY = height - blockHeight;

        let invaderCount = Math.abs(endResult) + 3;
        let spacing = blockWidth / (invaderCount + 1);

        for (let i = 0; i < invaderCount; i++) {
            let invaderX = blockX + (i + 1) * spacing;
            let invaderY = blockY - 10; // above castle wall
            invaders.push({ x: invaderX, y: invaderY });
        }
    }

    drawInvaders();

    fill(0);
    textFont('Patrick Hand');
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    textSize(32);

    let title = "";
    let description = "";

    if (endResult > 0) {
        title = "Congratulations!";
        description = "Great job! You built strong defenses and kept your data safe!";
    } else if (endResult === 0) {
        title = "Draw!";
        description = "Your defenses held, but it was a close call!";
    } else {
        title = "Defeat!";
        description = "Oh no! You didn't build up your defenses enough and got overrun by bad actors!";
    }

    let textMaxWidth = width / 2;
    let wrappedTitle = breakTextLines(title, textMaxWidth);
    let wrappedDescription = breakTextLines(description, textMaxWidth);

    let textY = height / 6;
    let textBoxHeight = wrappedTitle.length * 30 + wrappedDescription.length * 24 + 20;
    
    fill(255, 255, 255, 200);
    rect(width / 4 - width / 6, textY - 20, width / 3, textBoxHeight + 20, 10);

    fill(0);
    textSize(28);
    wrappedTitle.forEach((line, index) => {
        text(line, width / 4, textY + index * 30);
    });


    textSize(18);
    textY += wrappedTitle.length * 30 + 10;
    wrappedDescription.forEach((line, index) => {
        text(line, width / 4, textY + index * 24);
    });
}

function drawEndScreenRight() {
    let panelX = width * 0.6;
    let panelWidth = width * 0.35;
    let panelHeight = height * 0.85;
    let panelY = height * 0.075;
    let textMaxWidth = panelWidth - 80;

    // container
    textFont('Patrick Hand');
    textStyle(NORMAL);
    fill(255, 255, 255, 220);
    stroke(0);
    rect(panelX, panelY, panelWidth, panelHeight, 10);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Your Answers", panelX + panelWidth / 2, panelY + 40);

    textSize(20);
    let summaryText = `You got ${correctAnswers} out of ${questions.length} correct!`;
    text(summaryText, panelX + panelWidth / 2, panelY + 80);

    let startIndex = currentPage * questionsPerPage;
    let endIndex = Math.min(startIndex + questionsPerPage, questions.length);
    let yOffset = panelY + 120; 

    for (let i = startIndex; i < endIndex; i++) {
        let question = questions[i];
        let correct = (userAnswers[i] === question.correct);
        let icon = correct ? "✅" : "❌";

        let wrappedQuestion = breakTextLines(question.question, textMaxWidth);
        let wrappedDescription = breakTextLines(question.description, textMaxWidth);

        let questionHeight = wrappedQuestion.length * 22;
        let descriptionHeight = wrappedDescription.length * 18;
        let boxHeight = 50 + questionHeight + descriptionHeight;

        // question background box
        fill(correct ? 'rgba(100, 255, 100, 150)' : 'rgba(255, 100, 100, 150)');
        stroke(0);
        rect(panelX + 10, yOffset, panelWidth - 20, boxHeight, 10);

       // icon
        textSize(24);
        fill(0);
        text(icon, panelX + 25, yOffset + 25);

        // question text
        textSize(18);
        textAlign(LEFT, CENTER);
        let textY = yOffset + 20;
        wrappedQuestion.forEach((line, index) => {
            text(line, panelX + 60, textY + index * 22);
        });

        // description text
        textSize(14);
        fill(50);
        textY += questionHeight + 10;
        wrappedDescription.forEach((line, index) => {
            text(line, panelX + 60, textY + index * 18);
        });
        
        yOffset += boxHeight + 10;
    }

    createPaginationButtons(panelX, panelY, panelWidth, panelHeight);
}

function drawAnswerMessage() {
    if (!messageVisible) return;

    let boxWidth = width * 0.4; // 60% of screen width
    let boxHeight = 80;
    let boxX = (width - boxWidth) / 2; // Centered horizontally
    let boxY = height - 120; // Near the bottom

    // Draw the message box background
    fill(255, 255, 255, 220); // Light semi-transparent background
    stroke(0);
    rect(boxX, boxY, boxWidth, boxHeight, 10);

    // Draw the message text
    fill(0);
    textSize(22);
    textAlign(CENTER, CENTER);
    text(answerMessage, boxX + boxWidth / 2, boxY + boxHeight / 2);
}

function drawCastleWall() {
    if (quizLength > 0) {
        let blockWidth = width / 8;
        let blockHeight = (height * 0.8) / quizLength; 
        let endResult = correctAnswers - incorrectAnswers;

        if (!quizCompleted) {
            for (let i = 0; i < correctAnswers; i++) {
                let x = width / 10; 
                let y = height - (i + 1) * blockHeight; // Stacks blocks upwards
                fill('#5c5452'); 
                stroke(0); 
                rect(x, y, blockWidth, blockHeight); 
            }
        } else if (endResult > 0) {
            for (let i = 0; i < endResult; i++) {
                let x = width / 10; 
                let y = height - (i + 1) * blockHeight; 
                fill('#5c5452'); 
                stroke(0); 
                rect(x, y, blockWidth, blockHeight); 
            }
        } else {
            let x = width / 10;
            let y = height - blockHeight;             
            fill('#5c5452'); 
            stroke(0); 
            rect(x, y, blockWidth, blockHeight);
        }
    }
}

function drawInvaders() {
    invaders.forEach(invader => {
        if (knight) {
            let knightHeight = 75;
            let knightWidth = 75;
            image(knight, invader.x - knightWidth, invader.y - knightHeight, knightHeight, knightWidth);
        } else {
            fill('#ff0000');
            //noStroke();
            ellipse(dot.x, dot.y, 10, 10);
        }
    });
}

function addInvader() {
    let centerX = width - 100;
    let centerY = height - 100;
    let radius = 130;
    let angle = random(TWO_PI);
    let r = random(radius);
    let x = centerX + cos(angle) * r;
    let y = centerY + sin(angle) * r;
    invaders.push({ x, y });
}

// Load and shuffle questions
export function loadCastleData() {
    loadJSON("Assets/data/questionsCastle.json", (data) => {
        if (!data || data.length === 0) {
            console.error("Failed to load questionsCastle.json");
            return;
        }
        console.log("Loading in ", quizLength, " questions.");
        questions = shuffleArray(data).slice(0, quizLength); 
        currentQuestionIndex = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        quizCompleted = false;
        questionLoaded = true;
    }, (error) => console.error("Error loading JSON:", error));
}

export function castleMousePressed() {
    if (!difficultySelected) {
        if (!allowDifficultySelection) {
            console.log("Click ignored - Difficulty selection not ready yet.");
            return; // Prevent unintended clicks
        }

        let difficulties = ["Easy", "Medium", "Hard"];
        let quizLengths = [easyDifficulty, mediumDifficulty, hardDifficulty];

        for (let i = 0; i < difficulties.length; i++) {
            let x = width/2 - 100;
            let y = height/2 - 50 + i * 60;
            if (mouseX > x && mouseX < x+200 && mouseY > y && mouseY < y+50) {
                quizLength = quizLengths[i];
                difficultySelected = true; 
                console.log(`Difficulty selected: ${difficulties[i]} (${quizLength} questions)`);
                console.log("Difficulty selected flag:", difficultySelected);
                console.log("drawCastleGame() called.");
                if (isMusicPlaying) {
                    clickSound.currentTime = 0;
                    clickSound.play();
                }                
                loadCastleData(); // load data after difficulty is chosen
                return;
            }
        }
        return;
    }

    if (!questionLoaded || questions.length === 0 || quizCompleted) return;

    let yPosition = 300;
    let question = questions[currentQuestionIndex];

    question.options.forEach((_, index) => {
        let buttonWidth = 400;
        let buttonHeight = 50;
        let x = width / 2 - 200;
        let y = yPosition;

        if (mouseX > x && mouseX < x + buttonWidth && mouseY > y && mouseY < y + buttonHeight) {
            selectedAnswer = index;
            userAnswers[currentQuestionIndex] = index;
            if (selectedAnswer === question.correct) {
                console.log("Correct answer, plus one to castle strength!");
                correctAnswers++;
                console.log("Castle strength: ", correctAnswers);
                answerMessage = random(correctMessages);
                if (isMusicPlaying) {
                    correctSound.currentTime = 0;
                    correctSound.play();
                }
                
            } else {
                console.log("Incorrect answer, plus one to invaders strength!");
                incorrectAnswers++
                addInvader();
                console.log("Invader strength: ", incorrectAnswers);
                answerMessage = random(incorrectMessages);
                if (isMusicPlaying) {
                    incorrectSound.currentTime = 0;
                    incorrectSound.play();
                }
            }
            setTimeout(() => {
                nextQuestion();
            }, 500); // Delay for transition
        }
        yPosition += 60;
    });
}


export function castleMouseReleased() {
    // Placeholder for now, could be used for UI interactions later
}

function createPaginationButtons(panelX, panelY, panelWidth, panelHeight) {
    let buttonY = panelY + panelHeight - 50;
    let buttonWidth = 120;

    removePaginationButtons();

    // previous button
    if (currentPage > 0) {
        prevPageButton = createButton("Previous")
            .addClass('menu-button')
            .style('color', 'black')
            .mousePressed(() => {
                if (isMusicPlaying) {
                    clickSound.currentTime = 0;
                    clickSound.play();
                }
                changePage(-1)});
        prevPageButton.position(panelX + 20, buttonY);
    }

    // next button
    if ((currentPage + 1) * questionsPerPage < questions.length) {
        nextPageButton = createButton("Next")
            .addClass('menu-button')
            .style('color', 'black')
            .mousePressed(() => {
                if (isMusicPlaying) {
                    clickSound.currentTime = 0;
                    clickSound.play();
                }
                changePage(1)});
        nextPageButton.position(panelX + panelWidth - buttonWidth - 20, buttonY);
    }
}

function removePaginationButtons() {
    if (prevPageButton) {
        prevPageButton.remove();
        prevPageButton = null;
    }
    if (nextPageButton) {
        nextPageButton.remove();
        nextPageButton = null;
    }
}

function changePage(direction) {
    currentPage += direction;
    currentPage = constrain(currentPage, 0, Math.ceil(questions.length / questionsPerPage) - 1);

    removePaginationButtons();
    createPaginationButtons(width * 0.6, height * 0.075, width * 0.35, height * 0.85);
}

// Utility function to shuffle questions
function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function nextQuestion() {
    console.log("nextQuestion() called.");
    selectedAnswer = null;
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
    } else {
        quizCompleted = true;
    }
}

function preloadCastleImages() {
    console.log("Preloading castle images...");
    castleMainBg = loadImage("Assets/data/castle/castleMainBg.png");
    castleMainFg = loadImage("Assets/data/castle/castleMainFg.png");
    castleRubble = loadImage("Assets/data/castle/castleRubble.png");
    clouds = loadImage("Assets/data/clouds.svg");
    knight = loadImage("Assets/data/castle/knight.png");
}

// Function to wrap text to the next line
function breakTextLines(text, maxWidth) {
    let words = text.split(" "); 
    let lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
        let testLine = currentLine + (currentLine ? " " : "") + words[i];
        
        if (textWidth(testLine) <= maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }
    return lines;
}

// Expose functions globally
window.drawCastleGame = drawCastleGame;
window.mousePressed = castleMousePressed;
window.mouseReleased = castleMouseReleased;
