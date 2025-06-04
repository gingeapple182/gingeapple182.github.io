//All members

// Main Menu Logic

// Import the shared game state
import { gameState } from './gamestate.js';

// Ness
import {
  loadJungleData,
  startJungleGame,
  drawJungleGame,
  jungleMousePressed,
  jungleMouseReleased,
  resetJungleGame } from './jungle.js';

//kelvin added
import {
    startDetectiveGame,
    drawDetectiveGame,
    detectiveMousePressed,
    detectiveMouseReleased,
    detectiveMouseDragged,
    resetDetectiveGame
  } from './detective.js';

// Oliver
import {
  startCastleGame,
  drawCastleGame,
  castleMousePressed,
  castleMouseReleased,
  resetCastleGame } from './castle.js';

//brooke added
import {
  loadCharacterCustomisation,
  startCharacterCustomisation,
  drawCharacterCustomisation,
  togglePickers,
  removeCharacterCustomisation,
  hair, skin, shirt, gender
} from './characterCustomisation.js';

export { isMusicPlaying };

let mainMenuBackButton; // back button to get to joint group main menu.

let jungleButton, detectiveButton, castleButton, customiseButton, backButton;
let swiggleBot;
let mainBg, clouds;
let offset = 0;
let speechBubble; //Kelvin added
const scrollSpeed = 0.5;
let cursorHand, cursorArrow;
let mainAudio, jungleAudio, detectiveAudio, castleAudio, roomAudio;
let audioSymbol, noAudio, music;
//button noise
const clickSound = new Audio('Assets/data/audio/click.mp3');
const hoverSound = new Audio("Assets/data/audio/pop.mp3");
const swiggleNoise = new Audio("Assets/data/audio/swiggleBot.wav");

function preload() {
  //all music
  mainAudio = loadSound("Assets/data/audio/background_music1.wav");
  jungleAudio = loadSound("Assets/data/audio/jungleBgMusic.wav");
  detectiveAudio = loadSound("Assets/data/audio/detectiveBgMusic.wav");
  castleAudio = loadSound("Assets/data/audio/castleBgMusic.wav");
  roomAudio = loadSound("Assets/data/audio/roomBgMusic.wav");

  //set background music
  music = mainAudio;
  music.setVolume(0.3);

  //custom cursors -- not currently working
  cursorHand = loadImage("Assets/data/cursors/hand-1.png", () => {
    console.log("Hand cursor loaded!");
  }, (error) => {
    console.error("Error loading hand cursor", error);
  });
  cursorArrow = loadImage("Assets/data/cursors/arrow-1.png", () => {
    console.log("Arrow cursor loaded!");
  }, (error) => {
    console.error("Error loading arrow cursor", error);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setTimeout(() => {
    cursor('Assets/data/cursors/arrow-1.png', 0, 0);
  }, 500);

  //load background
  mainBg = loadImage("Assets/data/mainBg.svg", () => {
    console.log("Background loaded successfully!");
  });
  clouds = loadImage("Assets/data/clouds.svg", () => {
    console.log("Clouds loaded successfully!");
  });

  //load swiggle bot
  swiggleBot = createImg("Assets/data/swigglebot.svg");
  swiggleBot.size(300, 250); // Set the size
  swiggleBot.position(200, height / 2 - 100);


  //Kelvin added
  speechBubble = createDiv("");
  speechBubble.addClass("speech-bubble");
  speechBubble.hide(); // Hide initially

  //audio button
  audioSymbol = createImg("Assets/data/audioSymbol.png", "Audio On");
  noAudio = createImg("Assets/data/noAudio.png", "Audio Off");

  //size and position
  audioSymbol.size(100, 75);
  noAudio.size(100, 75);
  audioSymbol.position(windowWidth - 100, windowHeight - 75);
  noAudio.position(windowWidth - 100, windowHeight - 75);
  
  //show the correct one
  audioSymbol.hide();

  //click functionality
  audioSymbol.mousePressed(toggleSound);
  noAudio.mousePressed(toggleSound);

  loadJungleData();
  resetCastleGame();
  showMainMenu(); // Start by showing the main menu
}

// Draw is called universally 
function draw() {
  background(240); // Set the background color

  if (gameState.currentScreen === "jungle") {
    drawJungleGame(); // Call the jungle game logic from jungle.js
  } else if (gameState.currentScreen === "detective") {
    drawDetectiveGame(); // Call the detective game logic from detective.js
  } else if (gameState.currentScreen === "castle") {
    drawCastleGame(); // Call the castle game logic from castle.js
  } else if (gameState.currentScreen === "customise") {
    drawCharacterCustomisation(); //call character customisation
  } else {
    showMainMenu();
  }
}

function showMainMenu() {
  clear();
  if (mainBg && clouds) {
    image(mainBg, 0, 0, windowWidth, windowHeight);
  }
  scrollingBackground();
 
  // Display the main menu title and description
  textAlign(CENTER, CENTER);
  textSize(64);
  textFont('Fredoka One');
  textStyle(BOLD);
  fill('black');

  drawingContext.shadowOffsetX = 4;
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
   
  text("The Swiggles Game", width / 2, height / 4);
   
  //reset text
  textStyle(NORMAL);
  textSize(18);

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
   
  text("Select a game mode to get started:", width / 2, height / 3);

  //placeholder font for games
  textFont('Patrick Hand');

  togglePickers(false);

  const buttonStartY = height / 2 - 100;
  const buttonSpacing = 80;
   
  // Re-show SwiggleBot
  if (swiggleBot) {
    swiggleBot.show();
    const buttonStartY = height / 2 - 100;
    const desiredGap = 150;
    // base the position on one of the buttons; if jungleButton exists, use it.
    if (jungleButton) {
      const btnLeft = width / 2 - jungleButton.width / 2;
      swiggleBot.position(btnLeft - 300 - desiredGap, buttonStartY);
    } else {
      // Fallback position if buttons aren't created yet:
      swiggleBot.position(width / 2 - 300 - desiredGap, buttonStartY);
    }
  }

  if (!jungleButton) {
    jungleButton = createGameButton(
      "Safe Search Jungle",
      "Help Swiggle Bot navigate the jungle by searching safely!",
      "jungle",
      jungleAudio,
      0
    );
  }
  if (!detectiveButton) {
    detectiveButton = createGameButton(
      "Detective Ruff",
      "Sort reports with Detective Ruff by identifying suspicious content!",
      "detective",
      detectiveAudio,
      buttonSpacing
    );
  }
  if (!castleButton) {
    castleButton = createGameButton(
      "Privacy Castle Defence",
      "Build up your castle defences from cyber warriors by answering privacy questions",
      "castle",
      castleAudio,
      2 * buttonSpacing
    );
  }
  if (!customiseButton) {
    customiseButton = createGameButton(
      "Character Customisation (WIP)",
      "Create your own Swiggle character!",
      "customise",
      roomAudio,
      3 * buttonSpacing
    );
  }
  if (!mainMenuBackButton) {
    mainMenuBackButton = createButton("Back to portfolio")
      .addClass("menu-button")
      .position(20, windowHeight - 70)
      .mousePressed(() => {
        clickEffects();
        menuToGameSelect();
      });
  }  
  if (mainMenuBackButton) {
    mainMenuBackButton.show();
  }  
  if (backButton) {
    backButton.hide();
  }
}

//Kelvin added
function showSpeechBubble(text) {
  speechBubble.html(text);
  speechBubble.position(swiggleBot.x + 50, swiggleBot.y - 50); // Adjust above the bot
  speechBubble.show();
}
  
function hideSpeechBubble() {
  speechBubble.hide();
}
 
// Navigation logic to handle switching between game modes
function navigateTo(screen) {
  clear(); // Clear the canvas
  gameState.currentScreen = screen; // Update the current screen in the game state

  if (jungleButton) jungleButton.hide();
  if (detectiveButton) detectiveButton.hide();
  if (castleButton) castleButton.hide();
  if (customiseButton) customiseButton.hide();
  if (mainMenuBackButton) mainMenuBackButton.hide();
  

  //hide swiggle bot
  if (swiggleBot) swiggleBot.hide();

  // Show the back button
  if (screen !== "mainMenu" && !backButton) {
    backButton = createButton("Back to Main Menu")
      .position(20, 20)
      .mousePressed(() => {
        resetCastleGame();
        resetJungleGame();
        switchMusic(mainAudio);
        navigateTo("mainMenu");
      });
  }
  if (backButton && screen !== "mainMenu") {
    backButton.show();
  } else {
    backButton.hide(); // Hide the back button on main menu
  }
 
  if (backButton && screen === "mainMenu") {
    resetDetectiveGame(); //kelvin added
    resetCastleGame();
    removeCharacterCustomisation();
    showMainMenu();
    jungleButton.show();
    detectiveButton.show();
    castleButton.show();
    customiseButton.show();
    
    console.log("Loaded customisation:", { hair, skin, shirt, gender });
    if(backButton){
      backButton.hide();
    }
  }

  if (screen === "jungle") {
    console.log("Navigate to 'jungle'");
    startJungleGame(); // Call the jungle game logic from jungle.js
    backButton.show();
  } else if (screen === "detective") {
    console.log("Navigate to 'detective'");
    startDetectiveGame(); // Call the detective game logic from detective.js
    backButton.show();
    window.mouseDragged = detectiveMouseDragged; //ensure dragging works
  } else if (screen === "castle") {
    console.log("Navigate to 'castle'");
    startCastleGame(); // Call the castle game logic from castle.js
    backButton.show();
  } else if (screen === "customise"){
    loadCharacterCustomisation();
    startCharacterCustomisation();
    togglePickers(true);
    backButton.show();
  }
}

export function scrollingBackground() {
  //update the offset and wrap it when exceeding the image width
  offset = (offset + scrollSpeed) % clouds.width;
 
  //draw the image repeatedly across the canvas
  for (let x = -clouds.width; x < width; x += clouds.width) {
    image(clouds, x + offset, 0, clouds.width, 600);
  }
}

// Resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const buttonStartY = height / 2 - 100; // Starting vertical position for buttons
  const buttonSpacing = 80; // Spacing between buttons

  // Center buttons horizontally
  if (jungleButton) {
    jungleButton.position(width / 2 - jungleButton.width / 2, buttonStartY);
  }
  if (detectiveButton) {
    detectiveButton.position(width / 2 - detectiveButton.width / 2, buttonStartY + buttonSpacing);
  }
  if (castleButton) {
    castleButton.position(width / 2 - castleButton.width / 2, buttonStartY + 2 * buttonSpacing);
  }
  if (customiseButton) {
    customiseButton.position(width / 2 - customiseButton.width / 2, buttonStartY + 3 * buttonSpacing);
  }

  // Position SwiggleBot with a larger gap
  if (swiggleBot && jungleButton) {
    const desiredGap = 150; // Increase gap between SwiggleBot's right edge and buttons
    const btnLeft = width / 2 - jungleButton.width / 2;
    const imgWidth = 300; // fixed image width as set in setup
    swiggleBot.position(btnLeft - imgWidth - desiredGap, buttonStartY);
  }
}

function createGameButton(label, speechText, game, music, yOffset) {
  const buttonStartY = height / 2 - 100;
    
  let button = createButton(label)
    .addClass('menu-button')
    .mouseOver(() => {
      playEffects();
      showSpeechBubble(speechText);
      setCursorToHand();
    })
    .mouseOut(() => {
      hideSpeechBubble();
      setCursorToArrow();
    })
    .mousePressed(() => {
      clickEffects();
      switchMusic(music);
      navigateTo(game);
    });
  button.position((width / 2) - (button.width / 2), buttonStartY + yOffset);
  return button;
}

function menuToGameSelect() {
  window.location.href = '../../index.html';
}

let isMusicPlaying = false;

function toggleSound() {
  if (isMusicPlaying) {
    music.pause();
    audioSymbol.hide();
    noAudio.show();
  } else {
    music.loop();
    noAudio.hide();
    audioSymbol.show();
  }
  isMusicPlaying = !isMusicPlaying;
  hoverEffectsEnabled = !hoverEffectsEnabled;
  clickEffectsEnabled = !clickEffectsEnabled;
}

function switchMusic(newMusic) {
  if (music.isPlaying()) {
    music.stop();  //stop the current music
  }
  music = newMusic;  //update the current music
  if (isMusicPlaying) {
    music.loop();  //start playing new music if music was already on
  }
  if (music == castleAudio){
    music.setVolume(.8);
  }else{
    music.setVolume(0.3);
  }
}

let hoverEffectsEnabled = false; 
let clickEffectsEnabled = false;

//hover and click sound events to check if effects are enabled
function playEffects() {
  if (hoverEffectsEnabled) {
    hoverSound.currentTime = 0;
    hoverSound.play();
    swiggleNoise.currentTime = 0;
    swiggleNoise.play();
  }
}

function clickEffects(){
  if(clickEffectsEnabled){
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

function setCursorToHand() {
  setTimeout(() => {
    cursor('Assets/data/cursors/hand-1.png', 0, 0);
  }, 500);
}

function setCursorToArrow() {
  setTimeout(() => {
    cursor('Assets/data/cursors/arrow-1.png', 0, 0);
  }, 500);
}

// Control mouse clicks for each minigame
function mousePressed() {
  if (gameState.currentScreen === "jungle") {
    jungleMousePressed();
  }
  else if (gameState.currentScreen === "detective") {
    detectiveMousePressed();
  }
  else if (gameState.currentScreen === "castle") {
    castleMousePressed();
  }
}

function mouseReleased() {
  if (gameState.currentScreen === "jungle") {
    jungleMouseReleased();
  }
  else if (gameState.currentScreen === "detective") {
    detectiveMouseReleased();
  }
  else if (gameState.currentScreen === "castle") {
    castleMouseReleased();
  }
}

// Ness - Expose p5 lifecycle functions globally if needed:
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;
window.mouseDragged = detectiveMouseDragged;
window.onload = () => {
  document.body.style.cursor = 'url("Assets/data/cursors/arrow-1.png"), auto';
};