// Get the face images
const faceImages = document.querySelectorAll(".face-option");

// Get the eyes images
const eyesImages = document.querySelectorAll(".eye-option");

// Get the mouth images
const mouthImages = document.querySelectorAll(".mouth-option");

// Get the hair images
const hairImages = document.querySelectorAll(".hair-option");

// Get the outcome display element
const outcomeDisplay = document.querySelector(".outcome-display");

// Keep track of the currently selected elements
let selectedFace = null;
let selectedEyes = null;
let selectedMouth = null;
let selectedHair = null;

// Add event listeners to the face images
faceImages.forEach((face) => {
  face.addEventListener("click", function () {
    // Set the outcome display's HTML to the selected face image
    outcomeDisplay.innerHTML = `<img src="${face.src}" alt="Selected Face">`;

    // Keep the previously selected eyes if there was one
    if (selectedEyes) {
      outcomeDisplay.innerHTML += `<img src="${selectedEyes.src}" alt="Selected Eyes">`;
    }
    // Keep the previously selected mouth if there was one
    if (selectedMouth) {
      outcomeDisplay.innerHTML += `<img src="${selectedMouth.src}" alt="Selected Mouth">`;
    }
    // Keep the previously selected hair if there was one
    if (selectedHair) {
      outcomeDisplay.innerHTML += `<img src="${selectedHair.src}" alt="Selected Hair">`;
    }

    // Update the selected face variable
    selectedFace = face;
  });
});

// Add event listeners to the eyes images
eyesImages.forEach((eyes) => {
  eyes.addEventListener("click", function () {
    // Set the outcome display's HTML to the selected eyes image
    outcomeDisplay.innerHTML = `<img src="${eyes.src}" alt="Selected Eyes">`;

    // Keep the previously selected face if there was one
    if (selectedFace) {
      outcomeDisplay.innerHTML =
        `<img src="${selectedFace.src}" alt="Selected Face">` +
        outcomeDisplay.innerHTML;
    }
    // Keep the previously selected mouth if there was one
    if (selectedMouth) {
      outcomeDisplay.innerHTML += `<img src="${selectedMouth.src}" alt="Selected Mouth">`;
    }
    // Keep the previously selected hair if there was one
    if (selectedHair) {
      outcomeDisplay.innerHTML += `<img src="${selectedHair.src}" alt="Selected Hair">`;
    }

    // Update the selected eyes variable
    selectedEyes = eyes;
  });
});

// Add event listeners to the mouth images
mouthImages.forEach((mouth) => {
  mouth.addEventListener("click", function () {
    // Set the outcome display's HTML to the selected mouth image
    outcomeDisplay.innerHTML = `<img src="${mouth.src}" alt="Selected Mouth">`;

    // Keep the previously selected face if there was one
    if (selectedFace) {
      outcomeDisplay.innerHTML =
        `<img src="${selectedFace.src}" alt="Selected Face">` +
        outcomeDisplay.innerHTML;
    }

    // Keep the previously selected eyes if there was one
    if (selectedEyes) {
      outcomeDisplay.innerHTML += `<img src="${selectedEyes.src}" alt="Selected Eyes">`;
    }

    // Keep the previously selected hair if there was one
    if (selectedHair) {
      outcomeDisplay.innerHTML += `<img src="${selectedHair.src}" alt="Selected Hair">`;
    }

    // Update the selected mouth variable
    selectedMouth = mouth;
  });
});

// Add event listeners to the hair images
hairImages.forEach((hair) => {
  hair.addEventListener("click", function () {
    // Set the outcome display's HTML to the selected hair image
    outcomeDisplay.innerHTML = `<img src="${hair.src}" alt="Selected Hair">`;

    // Keep the previously selected face if there was one
    if (selectedFace) {
      outcomeDisplay.innerHTML =
        `<img src="${selectedFace.src}" alt="Selected Face">` +
        outcomeDisplay.innerHTML;
    }

    // Keep the previously selected eyes if there was one
    if (selectedEyes) {
      outcomeDisplay.innerHTML += `<img src="${selectedEyes.src}" alt="Selected Eyes">`;
    }

    // Keep the previously selected mouth if there was one
    if (selectedMouth) {
      outcomeDisplay.innerHTML += `<img src="${selectedMouth.src}" alt="Selected Mouth">`;
    }

    // Update the selected hair variable
    selectedHair = hair;
  });
});

//////////////////////////Navigation menu bar////////////////////////////////
