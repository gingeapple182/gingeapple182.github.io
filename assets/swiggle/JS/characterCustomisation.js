//Brooke - character customisation screen

let character;
export let gender = "female";
let characterSVG;
let hairColourPicker, skinColourPicker, shirtColourPicker, genderSelect;
let svgReady = false;
let pickersReady = false;
let pickersCreated = false;
let bg;
// New global array to store labels
let pickerLabels = [];

// Load the SVG and create the pickers
export function loadCharacterCustomisation() {
  loadSVG();
  createPickers();
  bg = loadImage("Assets/data/room.svg");
}

// Prints a message if function isn’t ready
// Call if both SVG and pickers are loaded
export function startCharacterCustomisation() {
  if (!svgReady || !pickersReady) {
    console.log("Pickers or image not ready");
    return;
  }
}

// Draw the character on canvas if needed
export function drawCharacterCustomisation() {
  if (bg) {
    image(bg, 0, 0, width, height);
  }
  if (character) {
    image(character, 100, 100, 500, 500);
  }
}

// Toggle visibility of the pickers
export function togglePickers(show) {
  if (show) {
    if (!pickersCreated) {
      createPickers();
    }
    hairColourPicker.show();
    skinColourPicker.show();
    shirtColourPicker.show();
    genderSelect.show();
    // Also show labels
    pickerLabels.forEach(label => label.show());
  } else {
    if (pickersCreated) {
      hairColourPicker.hide();
      skinColourPicker.hide();
      shirtColourPicker.hide();
      genderSelect.hide();
      // Also hide labels
      pickerLabels.forEach(label => label.hide());
    }
  }
}

// Create and position the dropdown menus and labels
function createPickers() {
  if (pickersCreated) return;

  const xOffset = 50;
  const yOffset = 250;
  const labelOffset = 80; 

  // Hair colour picker and label
  let hairLabel = createSpan("Hair: ");
  hairLabel.position(xOffset, yOffset);
  pickerLabels.push(hairLabel);
  hairColourPicker = createSelect();
  hairColourPicker.position(xOffset + labelOffset, yOffset);
  hairColourPicker.option('Blonde', '#fdd88f');
  hairColourPicker.option('Brunette', '#8b5a2b');
  hairColourPicker.option('Black', '#1c1c1c');
  hairColourPicker.option('Red', '#b55239');
  hairColourPicker.selected(hair);
  hairColourPicker.changed(updateCharacterColours);

  // Skin colour picker and label
  let skinLabel = createSpan("Skin: ");
  skinLabel.position(xOffset, yOffset + 40);
  pickerLabels.push(skinLabel);
  skinColourPicker = createSelect();
  skinColourPicker.position(xOffset + labelOffset, yOffset + 40);
  skinColourPicker.option('Light', '#f3c9a7');
  skinColourPicker.option('Tan', '#d9a066');
  skinColourPicker.option('Dark', '#8d5524');
  skinColourPicker.selected(skin);
  skinColourPicker.changed(updateCharacterColours);

  // Shirt colour picker and label
  let shirtLabel = createSpan("Shirt: ");
  shirtLabel.position(xOffset, yOffset + 80);
  pickerLabels.push(shirtLabel);
  shirtColourPicker = createSelect();
  shirtColourPicker.position(xOffset + labelOffset, yOffset + 80);
  shirtColourPicker.option('Red', '#ff4f4f');
  shirtColourPicker.option('Blue', '#4f9eff');
  shirtColourPicker.option('Green', '#4fff86');
  shirtColourPicker.option('Purple', '#a75589');
  shirtColourPicker.selected(shirt);
  shirtColourPicker.changed(updateCharacterColours);

  // Gender picker and label
  let genderLabel = createSpan("Gender: ");
  genderLabel.position(xOffset, yOffset + 120);
  pickerLabels.push(genderLabel);
  genderSelect = createSelect();
  genderSelect.position(xOffset + labelOffset, yOffset + 120);
  genderSelect.option('Female');
  genderSelect.option('Male');
  genderSelect.selected(gender.charAt(0).toUpperCase() + gender.slice(1));
  genderSelect.changed(() => {
    gender = genderSelect.value().toLowerCase();
    if (svgReady) {
      updateCharacterColours();
    }
  });

  pickersCreated = true;
  pickersReady = true;
}

// Updates the SVG colours
function updateCharacterColours() {
  if (svgReady) {
    const hairColour = hairColourPicker.value();
    const skinColour = skinColourPicker.value();
    const shirtColour = shirtColourPicker.value();

    updateCustomisation(hairColour, skinColour, shirtColour);

    updateSVG(hairColour, skinColour, shirtColour);
  } else {
    console.log("SVG not ready yet");
  }
}

// Load the SVG file
function loadSVG() {
  fetch("Assets/data/swiggleKid.svg")
    .then(response => response.text())
    .then(svgText => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(svgText, "image/svg+xml");
      characterSVG = doc.documentElement;
      svgReady = true;

      // Update the colours once pickers are ready
      if (pickersReady) {
        updateSVG(
          hairColourPicker.value(),
          skinColourPicker.value(),
          shirtColourPicker.value()
        );
      }
    })
    .catch(error => console.error("Error loading SVG:", error));
}

// Helper function to darken a hex colour by a given factor (e.g., 0.2 for 20% darker)
function darkenColor(hexColor, factor) {
  hexColor = hexColor.replace('#', '');
  let num = parseInt(hexColor, 16);
  let r = (num >> 16) & 0xFF;
  let g = (num >> 8) & 0xFF;
  let b = num & 0xFF;

  r = Math.max(0, Math.floor(r * (1 - factor)));
  g = Math.max(0, Math.floor(g * (1 - factor)));
  b = Math.max(0, Math.floor(b * (1 - factor)));

  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

// Update the SVG with new colours
function updateSVG(hairColour, skinColour, shirtColour) {
  if (!characterSVG) {
    console.warn("SVG not ready.");
    return;
  }

  if (
    !/^#[0-9A-Fa-f]{6}$/.test(hairColour) ||
    !/^#[0-9A-Fa-f]{6}$/.test(skinColour) ||
    !/^#[0-9A-Fa-f]{6}$/.test(shirtColour)
  ) {
    console.error("Invalid colour detected:", hairColour, skinColour, shirtColour);
    return;
  }

  // Update hair colour
  const hairElements = characterSVG.querySelectorAll(".hair");
  hairElements.forEach(elem => {
    elem.style.fill = hairColour;
  });

  // Update skin colour
  const skinElements = characterSVG.querySelectorAll(".skin");
  skinElements.forEach(elem => {
    elem.style.fill = skinColour;
  });

  // Update shirt colour and its shade (darker version)
  const shirtElements = characterSVG.querySelectorAll(".shirt");
  shirtElements.forEach(elem => {
    elem.style.fill = shirtColour;
  });
  const shirtShadeElements = characterSVG.querySelectorAll(".shirtShade");
  shirtShadeElements.forEach(elem => {
    elem.style.fill = darkenColor(shirtColour, 0.2); // 20% darker
  });

  // Get or create the container for the SVG
  let container = document.getElementById("characterContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "characterContainer";
    container.style.position = "fixed"; // Position fixed to stay in the same place on screen
    container.style.bottom = "-200px"; // Position at the bottom
    container.style.right = "0"; // Position at the right
    container.style.width = "500px";
    container.style.height = "500px";
    container.style.overflow = "hidden";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);
  }
  container.innerHTML = "";

  // Apply cropping based on gender
  if (gender === "female") {
    characterSVG.setAttribute("viewBox", "230 0 100 100");
  } else {
    characterSVG.setAttribute("viewBox", "230 100 100 100");
  }

  container.appendChild(characterSVG);
}


// Removes the SVG container, pickers, and labels from the DOM
export function removeCharacterCustomisation() {
  // Remove pickers if they have been created
  if (pickersCreated) {
    hairColourPicker.remove();
    skinColourPicker.remove();
    shirtColourPicker.remove();
    genderSelect.remove();

    // Also remove labels
    pickerLabels.forEach(label => label.remove());
    pickerLabels = []; // Clear the array

    pickersCreated = false;
    pickersReady = false;
  }

  // Remove the character container if it exists
  let container = document.getElementById("characterContainer");
  if (container) {
    container.remove();
  }
}

//export values
export let hair = "#fdd88f"; 
export let skin = "#f3c9a7";
export let shirt = "#ff4f4f";

export function updateCustomisation(hairColour, skinColour, shirtColour) {
  hair = hairColour;
  skin = skinColour;
  shirt = shirtColour;
  gender;
}