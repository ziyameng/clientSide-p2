import { drawEmojie } from "./drawEmojie.js";

let emojieFace = {
  face: null,
  eye: null,
  mouth: null,
  hair: null,
};

function drawEmojieParts(parts) {
  const container = document.getElementById("emojie-parts");
  container.innerHTML = "";

  const { eye, mouth, face, hair } = parts;

  function createPart(item, key) {
    const div = document.createElement("div");
    div.className = "emojie-part";

    div.onclick = () => {
      emojieFace[key] = item.src;
      drawOnCanvas();
    };

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.desc;
    img.height = 50;
    img.width = 50;

    const desc = document.createElement("div");
    desc.innerText = item.desc;

    div.appendChild(img);
    div.appendChild(desc);

    return div;
  }

  const faceElements = face.map((f) => createPart(f, "face"));
  const eyeElements = eye.map((e) => createPart(e, "eye"));
  const mouthElements = mouth.map((m) => createPart(m, "mouth"));
  const hairElements = hair.map((h) => createPart(h, "hair"));

  function createSection(elements, name, key) {
    const div = document.createElement("div");
    div.classList.add("component-container");
    const header = document.createElement("h2");
    header.innerText = name;
    div.appendChild(header);

    const elementContainer = document.createElement("div");
    elementContainer.className = "emojie-part-container";
    elements.forEach((el) => elementContainer.appendChild(el));
    div.appendChild(elementContainer);

    const remove = document.createElement("button");
    remove.classList.add("btn-remove");
    remove.innerText = "Remove";
    remove.onclick = () => {
      emojieFace[key] = null;
      drawOnCanvas();
    };

    elementContainer.appendChild(remove);

    return div;
  }

  container.appendChild(createSection(faceElements, "Face", "face"));
  container.appendChild(createSection(eyeElements, "Eye", "eye"));
  container.appendChild(createSection(mouthElements, "Mouth", "mouth"));
  container.appendChild(createSection(hairElements, "Hair", "hair"));
}

function drawOnCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  Object.values(emojieFace).forEach((src) => {
    if (!src) return;

    const img = document.createElement("img");
    img.src = src;
    canvas.appendChild(img);
  });
}

async function loadEmojiePart() {
  const res = await fetch("/api/emojie-parts");
  const parts = await res.json();

  drawEmojieParts(parts);
}
await loadEmojiePart();

async function fetchAndDrawCreatedEmojies() {
  const params = new URLSearchParams(window.location.search);

  const userSearch = params.get("user-search");
  const dateSearch = params.get("date-search");

  const userSearchEl = document.getElementById("user-search");
  userSearchEl.value = userSearch;
  const dateSearchEl = document.getElementById("date-search");
  dateSearchEl.value = dateSearch;

  const res = await fetch("/api/emojies", {
    method: "PUT",
    body: JSON.stringify({
      userSearch: userSearch || null,
      dateSearch: dateSearch ?? null,
    }),
    headers: {
      "Content-type": "application/json; chartset=UTF-8",
    },
  });
  const emojies = await res.json();

  const container = document.getElementById("browser");
  container.innerHTML = "";

  emojies.forEach((emoji) => {
    drawEmojie(container, emoji);
  });
}

await fetchAndDrawCreatedEmojies();

// Handle form submit.
const form = document.getElementById("create-emojie");

form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const description = formData.get("description");

  try {
    const res = await fetch("/api/create-emoji", {
      method: "POST",
      body: JSON.stringify({
        ...emojieFace,
        desc: description,
        username: localStorage.getItem("username") ?? "anonymous",
      }),
      headers: {
        "Content-type": "application/json; chartset=UTF-8",
      },
    });

    if (!res.ok) {
      throw new Error("server error");
    } else {
      await fetchAndDrawCreatedEmojies();
    }

    emojieFace = { face: null, eye: null, mouth: null, hair: null };
    drawOnCanvas();
  } catch (e) {
    alert(`Failed to create emoji: ${e.message}`);
  }
};
