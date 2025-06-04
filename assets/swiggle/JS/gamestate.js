// gamestate.js
const gameState = {
    currentScreen: "mainMenu", // Tracks which screen is currently active
    playerHealth: 100,        // Initial health for the player
    enemyAttack: 0,           // Initial attack power for the enemy
    jungleProgress: 0,        // Tracks progress in the Safe Search Jungle
    detectiveProgress: 0,     // Tracks progress in the Detective Dog game
    castleQuizData: [],       // Placeholder for quiz data in the Privacy Castle Defence
  };
  
  // function to reset the gamestate
  function resetGameState() {
    gameState.currentScreen = "mainMenu";
    gameState.playerHealth = 100;
    gameState.enemyAttack = 0;
    gameState.jungleProgress = 0;
    gameState.detectiveProgress = 0;
    gameState.castleQuizData = [];
  }
  
  export { gameState, resetGameState };
  