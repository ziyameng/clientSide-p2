/***** Maker page: create emoji combination ******/
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

/******* Navigation menu bar ********/
// Get all the buttons in the menu
const buttons = document.querySelectorAll(".menu-btn");

// Loop through the buttons and add a click event listener
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // Prevent the default link behavior
    event.preventDefault();

    // Get the section ID from the href attribute of the link inside the button
    const sectionId = button.querySelector("a").getAttribute("href");

    // Deactivate all sections
    document.querySelectorAll("section").forEach((section) => {
      section.classList.remove("active");
    });

    // Activate the selected section
    document.querySelector(sectionId).classList.add("active");

    // Update the active button in the menu
    document.querySelectorAll(".menu-btn").forEach((button) => {
      button.classList.remove("active");
    });
    button.classList.add("active");
  });
});

/****** Post on browser page*******/
const postForm = document.querySelector(".post-form");
const displayOutcome = document.querySelector(".outcome-display");
const postsContainer = document.querySelector(".posts-container");

postForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const emojitarId = postForm.querySelector(".emojitar-id").value;
  const description = postForm.querySelector(".description").value;
  const username = postForm.querySelector(".username").value;

  const post = document.createElement("div");
  post.classList.add("post");
  post.innerHTML = `
    <div class="post-header">
      <h3>EmojitarId: ${emojitarId}</h3>
      <p>Description: ${description}</p>
      <span>Posted by ${username}</span>
    </div>
    <div class="post-body">
      ${displayOutcome.innerHTML}
    </div>
    <button class="view-comment-btn"><a href="#comments-section">View Comments</a></button>

  `;

  postsContainer.appendChild(post);

  // Get the "View Comments" button
  const viewCommentsBtn = document.querySelector(".view-comment-btn a");

  // Get the comments section
  const commentsSection = document.getElementById("comments-section");

  // Hide the comments section initially
  commentsSection.style.display = "none";

  // Add click event listener to the "View Comments" button
  viewCommentsBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Hide the "Browser page" section
    const browserPageSection = document.getElementById("browser-page");
    browserPageSection.style.display = "none";

    // Display the comments section
    commentsSection.style.display = "block";
  });
});
