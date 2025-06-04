// kelvin

import { gameState } from './gamestate.js';

let reports = []; // array to store reports loaded from JSON
let dropZones = {}; // drop areas
let draggingReport = null; // track which report is being dragged
let dataReady = false;
let popupMessage = "";
let popupTimer = 0;
let score = 0; // Number of correctly placed papers
let sortedCount = 0; // Number of papers placed
let gameOver = false; // Game Over flag
const maxTries = 5; // Maximum allowed tries
let triesLeft = maxTries; // Tracks remaining tries
const restartButton = { width: 180, height: 50 };
let showIntro = true;
let introFadeProgress = 0;
let titleTransitionProgress = 0;
let detectiveMainBg, detectiveMainFg, dog; // - Oliver
let showSpeechBubble = false;
let speechBubbleMessage = "";
let speechBubbleTimer = 0;
let speechBubbleTextIndex = 0; // Tracks progress for typing effect
let speechBubbleFullMessage = ""; // Stores the full message
let speechBubbleTypingSpeed = 30; // Speed of typing effect in milliseconds
const incorrectSpeechMessages = [
    "Hmm... that doesn't seem right!",
    "Take another look!",
    "Are you sure about that?",
    "Not quite, try again!",
    "Let's think this through!",
    "I don’t think that’s the right choice.",
    "Double-check your reasoning!",
    "Something feels off about that one.",
    "You might want to reconsider!",
    "That doesn’t seem to add up.",
    "Detectives always double-check their work!",
    "Look closely—does that really belong there?",
    "That answer might need a second look!",
    "Think about it carefully!",
    "Hmm... I wouldn’t be so sure about that.",
    "Maybe try another approach?",
    "Let's go over the details again.",
    "I'm not convinced—check the facts again!",
    "Does that really make sense?",
    "Take a step back and review it."
];
const correctSpeechMessages = [
    "Good job!",
    "Well done, detective!",
    "You're on the right track!",
    "Nice work!",
    "You're getting the hang of this!",
    "Fantastic!",
    "Keep it up!",
    "Excellent decision!",
    "You're a great detective!",
    "Spot on!",
    "You're solving the case!",
    "Brilliant thinking!",
    "That's correct!",
    "Great choice!",
    "Smart move!"
];
// Adjusting sizes for portrait mode
const reportWidth = 250;  // Increased width
const reportHeight = 325; // Increased height (Portrait mode)
const dropZoneWidth = 350; // Increased drop zone size
const dropZoneHeight = 200

export function loadDetectiveData(callback) {
    loadJSON(
        'Assets/data/questionsDetective.json',
        (loadedReports) => {

            console.log("Loaded JSON:", loadedReports);
            
            if (!Array.isArray(loadedReports)) {
                console.error("Invalid JSON format: Expected an array but got", loadedReports);
                return;
            }

            // Shuffle the array using Fisher-Yates algorithm
            for (let i = loadedReports.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [loadedReports[i], loadedReports[j]] = [loadedReports[j], loadedReports[i]];
            }

            // Select the first 5 questions from the shuffled array
            const selectedReports = loadedReports.slice(0, 5);

            reports = selectedReports.map(report => ({
                text: report.text || report.question,  // Use 'text' or fallback to 'question'
                correctZone: report.correctZone || "report", // Provide a default if missing
                date: generateRandomDate(),
                x: 200, 
                y: 100,
                targetX: 200, // Add a target position for animation
                targetY: 100,
                dragging: false, 
                placed: false,
                greyedOut: true // Initially set all papers to greyed out
            }));

            if (reports.length > 0) {
                reports[reports.length - 1].greyedOut = false; // Make the bottom-most report white
            }            
            
            console.log("Detective reports loaded:", reports);
            dataReady = true;
            if (callback) callback();
        },
        (err) => {
            console.error("Failed to load JSON data for Detective:", err);
        }
    );
}

function generateRandomDate() {
    let start = new Date(2025, 0, 1);
    let randomDate = new Date(start.getTime() + Math.random() * (Date.now() - start.getTime()));
    return `Date: ${randomDate.toLocaleDateString("en-GB")}`;
}

function drawSpeechBubble(x, y) {
    let padding = 20; // Space around text
    let maxWidth = 300; // Max width before wrapping
    let lineHeight = 22; // Line spacing
    let displayedText = speechBubbleFullMessage.substring(0, speechBubbleTextIndex); // Typing effect

    // Split words for wrapping
    let words = displayedText.split(" ");
    let lines = [];
    let currentLine = "";

    for (let word of words) {
        let testLine = currentLine + word + " ";
        if (textWidth(testLine) > maxWidth - padding * 2) {
            lines.push(currentLine);
            currentLine = word + " ";
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine); // Push last line

    // Calculate bubble size dynamically
    let bubbleWidth = min(maxWidth, textWidth(displayedText) + padding * 2);
    let bubbleHeight = lines.length * lineHeight + padding * 2;

    // **Fix: Position bubble near the character**
    let bubbleX = x - bubbleWidth / 2;
    let bubbleY = y - bubbleHeight + 40; // Moves it slightly above 'y' (adjust if needed)

    // Draw speech bubble with rounded corners
    fill(255);
    stroke(0);
    strokeWeight(3);
    rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 15);

    // **Fix: Ensure text is centered inside the bubble**
    fill(0);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);

    let textX = bubbleX + bubbleWidth / 2;
    let textY = bubbleY + bubbleHeight / 2; // Now centers the text perfectly!

    for (let i = 0; i < lines.length; i++) {
        let lineOffset = (i - (lines.length - 1) / 2) * lineHeight; // Centering adjustment
        text(lines[i], textX, textY + lineOffset);
    }

    // Typing effect logic
    if (speechBubbleTextIndex < speechBubbleFullMessage.length) {
        if (millis() - speechBubbleTimer > speechBubbleTypingSpeed) {
            speechBubbleTextIndex++;
            speechBubbleTimer = millis();
        }
    }
}

// Function to draw the intro screen
function drawIntroScreen() {
    clear();
    // Background gradient
    if (detectiveMainBg && detectiveMainFg && dog) { //add in background and detective dog - Oliver
        let dogWidth = 250;
        let dogHeight = 250;
        let dogX = width - dogWidth - 20;
        let dogY = 20;
        image(detectiveMainBg, 0, 0, width, height);
        image(dog, dogX, dogY, dogWidth, dogHeight);
        image(detectiveMainFg, 0, 0, width, height);
        console.log("Background loaded successfully!");
    }

    const centerX = width / 2;
    const centerY = height / 2;

    let minTitleY = 40; // Prevent title from going too high
    let minSubtitleY = 70; // Prevent subtitle from going too high

    let titleY = constrain(lerp(centerY - 170, minTitleY, titleTransitionProgress), minTitleY, centerY - 100);
    let subtitleY = constrain(lerp(centerY - 120, minSubtitleY, titleTransitionProgress), minSubtitleY, centerY - 80);

    // Draw Game Title & Subtitle (Animating to the top)
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0); // Dark detective-like color with fade
    text("Detective Minigame", centerX, titleY - 100);

    textSize(25);
    text("Sort the reports into the correct category!", centerX, subtitleY - 100);

    // Fade out effect for the rest of the text
    let fadeAlpha = lerp(255, 0, introFadeProgress); // Gradually fades out

    // Instruction Box
    fill(255, fadeAlpha); // White background fading out
    stroke(0, fadeAlpha * 0.4);
    strokeWeight(2);
    rect(centerX - 350, centerY - 90, 700, 190, 20);

    // Instruction Text inside the box
    fill(0, fadeAlpha);
    noStroke();
    textSize(22);
    textFont("Baloo");
    text(
        "Read through reports carefully and decide if\nthey are safe or need to be reported.\n\nYour mission as Detective Dog is to help\nfigure out if we need to report situations!",
        centerX, centerY
    );

    // "Let's Go" Button with fading effect
    let buttonX = centerX - 100;
    let buttonY = centerY + 120;
    let buttonWidth = 200;
    let buttonHeight = 70;

    let isHoveringLetsGo =
        mouseX > buttonX &&
        mouseX < buttonX + buttonWidth &&
        mouseY > buttonY &&
        mouseY < buttonY + buttonHeight;

    fill(isHoveringLetsGo ? `rgba(174, 214, 241, ${fadeAlpha / 255})` : `rgba(255, 255, 255, ${fadeAlpha / 255})`);
    stroke(0, fadeAlpha);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20);

    fill(0, fadeAlpha);
    noStroke();
    textSize(28);
    text("Let's Go!", centerX, centerY + 155);

    if (isHoveringLetsGo) {
        cursor("pointer");
    }
}

// Initializes the detective minigame
export function startDetectiveGame() {
    console.log("🔄 Starting Detective Game...");
    resetDetectiveGame();

    preloadDetectiveImages(); // Load images - Oliver

    if (!dataReady) {
        console.log("🔄 Loading detective reports...");
        loadDetectiveData(() => {
            console.log("✅ Data Loaded! Now starting game...");
            initDetectiveGame(); // Only start game after data is fully loaded
        });
    } else {
        console.log("⚡ Data already loaded, starting immediately...");
        initDetectiveGame();
    }
}

function initDetectiveGame() {
    let canvasSize = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };    

    createCanvas(canvasSize.width, canvasSize.height);
    background(200);
    
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw game title and instructions
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("Detective Minigame", centerX, centerY - 250);

    textSize(18);
    text("Sort the reports into the correct category!", centerX, centerY - 220);

     // Move reports HIGHER
     const reportsStartY = height / 2 - 200; // Moved reports up


    // Adjust report stacking position
    const stackOffset = 0; // Increased spacing
    reports.forEach((report, index) => {
        report.x = centerX - reportWidth / 2;
        report.y = reportsStartY + index * stackOffset;
        report.targetX = report.x;
        report.targetY = report.y;
    });

    loop();
}

// Draw function to display game elements
export function drawDetectiveGame() {
    if (showIntro) {
        drawIntroScreen();
        return; // Prevents the game from rendering
    }

    clear();
    //background(220);
    if (detectiveMainBg && detectiveMainFg && dog) { //add in background and detective dog - Oliver
        let dogWidth = 250;
        let dogHeight = 250;
        let dogX = width - dogWidth - 20;
        let dogY = 20;
        image(detectiveMainBg, 0, 0, width, height);
        image(dog, dogX, dogY, dogWidth, dogHeight);
        image(detectiveMainFg, 0, 0, width, height);
        console.log("Background loaded successfully!");
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw game title
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0);
    text("Detective Minigame", centerX, 40);

    // Display remaining moves
    if (!gameOver){
    textSize(25);
    fill(0);
    const movesLeftY = height - 60; // 20px above the very bottom
    text(`Moves Left: ${triesLeft}`, centerX, movesLeftY);
    }

    textSize(25);
    text("Sort the reports into the correct category!", centerX, 80);

    restartButton.x = width - restartButton.width - 20; // 20px from right edge
    restartButton.y = 20;


    // Draw the Restart button
    if (!gameOver) {
        let isHoveringRestart =
        mouseX > restartButton.x &&
        mouseX < restartButton.x + restartButton.width &&
        mouseY > restartButton.y &&
        mouseY < restartButton.y + restartButton.height;

    fill(isHoveringRestart ? "#D6EAF8" : 255); // Light blue hover
    stroke(0);
    strokeWeight(1.5);
    rect(restartButton.x, restartButton.y, restartButton.width, restartButton.height, 4);

    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Restart", restartButton.x + restartButton.width / 2, restartButton.y + restartButton.height / 2);

    // Change cursor when hovering over Restart button
    if (isHoveringRestart) {
        cursor("pointer");
    } else {
        cursor("default");
    }
    }

    if (gameOver) {
        textSize(50);
        fill(0);
        text("Game Over!", centerX, height / 2 - 120);
        textSize(35);
        text(`Your Score: ${score} / ${reports.length}`, centerX, height / 2 - 70);
    
        let restartGameX = centerX - restartButton.width / 2;
        let restartGameY = height / 2;

        // Detect Hover for Restart Game button
        let isHoveringGameRestart =
            mouseX > restartGameX &&
            mouseX < restartGameX + restartButton.width &&
            mouseY > restartGameY &&
            mouseY < restartGameY + restartButton.height;

        fill(isHoveringGameRestart ? "#D6EAF8" : 255); // Light blue hover
        stroke(0);
        strokeWeight(1.5);
        rect(restartGameX, restartGameY, restartButton.width, restartButton.height, 8);

        noStroke();
        fill(0);
        textSize(25);
        textAlign(CENTER, CENTER);
        text("Restart Game", centerX, height / 2 + restartButton.height / 2 - 2);

        // Change cursor when hovering over Restart Game button
        if (isHoveringGameRestart) {
            cursor("pointer");
        }
    
        return;
    }

    const bottomY = height - dropZoneHeight - 50; // Keep it at the bottom

    // Dynamically update drop zones so they don't move when zooming
    dropZones["report"] = {
        x: centerX - 500, // Left side
        y: bottomY,
        w: dropZoneWidth,
        h: dropZoneHeight,
        label: "Report"
    };

    dropZones["accept"] = {
        x: centerX + 150, // Right side
        y: bottomY,
        w: dropZoneWidth,
        h: dropZoneHeight,
        label: "Accept"
    };

    // Draw drop zones
    for (let key in dropZones) {
        let zone = dropZones[key];
        stroke(0);
        strokeWeight(2);
        fill(180);
        rect(zone.x, zone.y, dropZoneWidth, dropZoneHeight, 10);
        fill(0);
        noStroke(); // Remove stroke for text
        textSize(22);
        textAlign(CENTER, CENTER);
        text(zone.label, zone.x + dropZoneWidth / 2, zone.y + dropZoneHeight - 30);
    }

    // Inside drawDetectiveGame function
    if (showSpeechBubble) {
        drawSpeechBubble(width - 250, 200, speechBubbleMessage); // Adjust position near the dog

        // Hide speech bubble after 2 seconds
        if (millis() - speechBubbleTimer > 3000) {
            showSpeechBubble = false;
        }
    }

    // Draw draggable reports
    for (let report of reports) {
        if (report.hidden) continue; // **Skip hidden reports**

        if (report.placed) {
            let zone = dropZones[report.correctZone];
            if (zone) {
                report.targetX = zone.x + (zone.w - reportWidth) / 2; // Keep report centered in the box
                report.targetY = zone.y - 90; // Move report above the box
            }
        } else if (!report.dragging) {
            report.targetX = width / 2 - reportWidth / 2;
        }
        
        if (!report.dragging) { 
            report.x = lerp(report.x, report.targetX, 0.1);
            report.y = lerp(report.y, report.targetY, 0.1);
        }

        let visibleHeight = report.placed ? 90 : reportHeight; // **Hide the bottom half if placed**

        fill(report.placed ? 200 : report.greyedOut ? 220 : 255);
        stroke(0);
        rect(report.x, report.y, reportWidth, visibleHeight);

        noStroke();
        fill(report.placed ? 100 : report.greyedOut ? 150 : 0);

        // Draw report header
        textSize(30);
        textAlign(CENTER, CENTER);
        text("REPORT", report.x + reportWidth / 2, report.y + 30);

        // Display the date
        textSize(20);
        textAlign(LEFT, CENTER);
        text(report.date, report.x + 10, report.y + 70);

        // 🐶 Add dog-themed decorations inside the paper
        textSize(30);
        textAlign(LEFT, CENTER);
        text("🐶", report.x + 10, report.y + 30); // Top-left corner
        text("🐶", report.x + reportWidth - 50, report.y + 30); // Top-right corner


        // Draw report text (only the top half is visible when placed)
        textSize(18);
        textAlign(LEFT, TOP);
        if (!report.placed) {
            // Show full text when not placed
            drawWrappedText(report.text, report.x + 10, report.y + 100, reportWidth - 20, 18);
        }
    }

    // Draw popup message if active
    if (popupTimer > 0) {
        textSize(30);
        fill(popupMessage === "Try Again!" ? color(200, 0, 0) : color(0, 200, 0));
        textAlign(CENTER, CENTER);
        text(popupMessage, centerX, height / 2 + 250);

        popupTimer--;
        if (popupTimer === 0) popupMessage = "";
    }
}

// Helper function for word wrapping
function drawWrappedText(txt, x, y, boxWidth, lineHeight) {
    const words = txt.split(' ');
    let line = '';
    let lines = [];
    
    for (let word of words) {
        let testLine = line + word + ' ';
        let testWidth = textWidth(testLine);
        if (testWidth > boxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line); // Push the last line

    for (let i = 0; i < lines.length; i++) {
        text(lines[i], x, y + i * lineHeight);
    }
}

// Mouse events
export function detectiveMousePressed() {
    if (showIntro) {
        const centerX = width / 2;
        const buttonX = centerX - 75;
        const buttonY = height / 2 + 120;

        if (mouseX > buttonX && mouseX < buttonX + 150 && mouseY > buttonY && mouseY < buttonY + 50) {
            console.log("🎬 Let's Go button clicked! Starting transition...");

            // Start fading out the lower text and animating the title
            let fadeInterval = setInterval(() => {
                introFadeProgress += 0.04; // Speed of fade
                titleTransitionProgress += 0.02; // Speed of animation
                if (introFadeProgress >= 1 && titleTransitionProgress >= 0.5) {
                    clearInterval(fadeInterval);
                    showIntro = false; // Switch to the game screen
                    startDetectiveGame(); // Start the game
                }
            }, 30);
        } 
        return;
    }
    // Check if the Restart button was clicked
    if (
        mouseX > restartButton.x &&
        mouseX < restartButton.x + restartButton.width &&
        mouseY > restartButton.y &&
        mouseY < restartButton.y + restartButton.height
    ) {
        restartGame();
        return; // Exit to avoid interfering with other click logic
    }
    
    for (let i = reports.length - 1; i >= 0; i--) { // Check from top of stack
        let report = reports[i];
        if (
            mouseX > report.x && 
            mouseX < report.x + reportWidth &&  // Now using full width
            mouseY > report.y && 
            mouseY < report.y + reportHeight   // Now using full height
        ) {
            report.dragging = true;
            draggingReport = report;

            // **Fix: Store the click offset inside the paper**
            report.offsetX = mouseX - report.x;
            report.offsetY = mouseY - report.y;

            // Save the original position for snap-back logic
            report.originalX = report.x;
            report.originalY = report.y;

            // Update greyedOut state: Only the topmost unplaced report is active
            reports.forEach((r, index) => {
                r.greyedOut = index !== i; // Grey out all papers except the one being dragged
            });

            // Move the dragged report to the top of the stack
            reports.splice(i, 1); // Remove the dragged report
            reports.push(report); // Add it to the end of the array (top of the stack)
            break;
        }
    }
    if (gameOver) {
        const centerX = width / 2;
        const buttonX = centerX - 75;
        const buttonY = height / 2;

        // Check if the Restart Game button was clicked
        if (
            mouseX > buttonX &&
            mouseX < buttonX + 150 &&
            mouseY > buttonY &&
            mouseY < buttonY + 50
        ) {
            restartGame();
        }
    }
}

function restartGame() {
    score = 0;
    sortedCount = 0;
    triesLeft = maxTries; // Reset tries to the maximum allowed
    gameOver = false;
    popupMessage = "";
    popupTimer = 0;

    // Reset speech bubble state
    showSpeechBubble = false;
    speechBubbleMessage = "";
    speechBubbleTimer = 0;
    speechBubbleTextIndex = 0;
    speechBubbleFullMessage = "";

    const centerX = width / 2;
    const reportsStartY = height / 2; // Move reports to the center

    // Move all reports back to the middle
    reports.forEach(report => {
        report.placed = false;
        report.targetX = centerX - reportWidth / 2;
        report.targetY = reportsStartY - 200;
    });

    // Start title slide-back animation
    let fadeSpeed = 0.02;
    let moveSpeed = 0.03;

    let slideBackInterval = setInterval(() => {
        introFadeProgress -= fadeSpeed; // Gradually bring back the fade-in effect
        titleTransitionProgress -= moveSpeed; // Move the title downward

        if (titleTransitionProgress <= 0) {
            titleTransitionProgress = 0;
        }
        if (introFadeProgress <= 1) {
            introFadeProgress = 1;
        }

        drawDetectiveGame(); // Redraw with updated positions

        if (titleTransitionProgress === 0 && introFadeProgress === 1) {
            clearInterval(slideBackInterval);
            showIntro = true;
            introFadeProgress = 0; // Reset fade progress for next transition
            titleTransitionProgress = 0; // Reset title movement
        }
    }, 30);
}

export function detectiveMouseDragged() {
    if (draggingReport) {
        draggingReport.x = mouseX - draggingReport.offsetX; // Keep the offset when dragging
        draggingReport.y = mouseY - draggingReport.offsetY;
    }
}

export function detectiveMouseReleased() {
    if (draggingReport) {
        let droppedInZone = false;

        for (let key in dropZones) {
            let zone = dropZones[key];

            // Check if the report is dropped above this zone
            if (
                mouseX > zone.x &&
                mouseX < zone.x + zone.w &&
                mouseY > zone.y - reportHeight &&
                mouseY < zone.y + zone.h
            ) {
                if (draggingReport.correctZone === key) {
                    console.log("✅ Correct placement!");

                    draggingReport.targetX = zone.x + (zone.w - reportWidth) / 2; // Center horizontally
                    draggingReport.targetY = zone.y - reportHeight + 150; // Moves the report **above** the box

                    draggingReport.placed = true;
                    draggingReport.hidden = false; // Ensure the placed report remains visible

                    // Increment score and sorted count
                    score++;
                    sortedCount++;

                    triesLeft--;

                    // Set popup message
                    popupMessage = "Correct!";
                    popupTimer = 60; // Show the popup for ~1 second (60 frames)

                    if (triesLeft === 0) {
                        gameOver = true;
                        speechBubbleFullMessage = "Game Over!";
                    } else {
                        // Otherwise, use correct message
                        speechBubbleFullMessage = random(correctSpeechMessages);
                    }
                    speechBubbleMessage = "";
                    speechBubbleTextIndex = 0; // Reset typing effect
                    showSpeechBubble = true;
                    speechBubbleTimer = millis();

                } else {
                    console.log("❌ Wrong placement!");

                    // Snap back to original position
                    draggingReport.targetX = draggingReport.originalX;
                    draggingReport.targetY = draggingReport.originalY;

                    sortedCount++;
                    triesLeft--;

                    // Set popup message
                    popupMessage = "Try Again!";
                    popupTimer = 60; // Show the popup for ~1 second (60 frames)

                    if (triesLeft === 0) {
                        gameOver = true;
                        speechBubbleFullMessage = "Game Over!";
                    } else {
                        // Otherwise, use incorrect message
                        speechBubbleFullMessage = random(incorrectSpeechMessages);
                    }
                    speechBubbleMessage = "";
                    speechBubbleTextIndex = 0; // Reset typing effect
                    showSpeechBubble = true;
                    speechBubbleTimer = millis();
                }
                droppedInZone = true;
                break;
            }
        }

        // If not dropped in any valid zone, snap back to original position
        if (!droppedInZone) {
            console.log("⚠️ Try again!");
            draggingReport.targetX = draggingReport.originalX;
            draggingReport.targetY = draggingReport.originalY;

            // Set popup message
            popupMessage = "Try Again!";
            popupTimer = 60; // Show the popup for ~1 second (60 frames)
        }
        // Reset greyedOut state: make the next unplaced report white
        reports.forEach((report, index) => {
            report.greyedOut = !report.placed && index !== reports.length - 1; // Only the last unplaced report is active
        });

        draggingReport.dragging = false; // Stop dragging
        draggingReport = null; // Clear the reference

        // Find the bottom-most unplaced report and make it white
        const bottomUnplacedReport = [...reports].reverse().find((report) => !report.placed);
        if (bottomUnplacedReport) bottomUnplacedReport.greyedOut = false;

        if (sortedCount === reports.length) {
            setTimeout(() => {
                gameOver = true;
            }, 1000); 
        }
    }
}

export function resetDetectiveGame(){
    clear();
    if (gameState.currentScreen !== "detective") {
        showIntro = true;
        introFadeProgress = 0;
        titleTransitionProgress = 0;
    }
}

function preloadDetectiveImages() { //load in images - Oliver
    console.log("Preloading detective images...");
    detectiveMainBg = loadImage("Assets/data/detective/detectiveBg.png", () => redraw());
    detectiveMainFg = loadImage("Assets/data/detective/detectiveFg.png", () => redraw());
    dog = loadImage("Assets/data/detective/dog.png", () => redraw());
}

// Ensure p5.js event handlers are correctly exposed
window.mousePressed = detectiveMousePressed;
window.mouseReleased = detectiveMouseReleased;
window.mouseDragged = detectiveMouseDragged;
window.draw = function(){
    if (gameState.currentScreen === "detective"){
        drawDetectiveGame();
    }
}