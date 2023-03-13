import { drawEmoji } from "./drawEmoji.js";

let emojiFace = {
  face: null,
  eye: null,
  mouth: null,
  hair: null,
};
let emojiStyles = {
  face: null,
  eye: null,
  mouth: null,
  hair: null,
};
let emojiCustomiseStack = [];

// https://stackoverflow.com/a/50942954
function drawCustomize() {
  const filterInputs = document.getElementById("emojie-filters-inputs");

  const stackOrder = document.getElementById("stack-order");

  if (emojiCustomiseStack.length) {
    stackOrder.innerHTML = `
    Stacking emoji parts in the following order: <span>${emojiCustomiseStack.join(
      " -> "
    )}</span>
    `;
  } else {
    stackOrder.innerHTML = "";
  }

  if (!emojiCustomiseStack.length) filterInputs.style.display = "none";
  else filterInputs.style.display = "flex";

  const invert = document.getElementById("invert");
  const sepia = document.getElementById("sepia");
  const saturate = document.getElementById("saturate");
  const brightness = document.getElementById("brightness");
  const contrast = document.getElementById("contrast");

  const key = emojiCustomiseStack.at(-1);
  if (!key) {
    invert.value = undefined;
    sepia.value = undefined;
    saturate.value = undefined;
    brightness.value = undefined;
    contrast.value = undefined;

    return;
  }

  invert.value = emojiStyles[key]?.invert ?? undefined;
  sepia.value = emojiStyles[key]?.sepia ?? undefined;
  saturate.value = emojiStyles[key]?.saturate ?? undefined;
  brightness.value = emojiStyles[key]?.brightness ?? undefined;
  contrast.value = emojiStyles[key]?.contrast ?? undefined;

  invert.oninput = (e) => {
    const value = e.target.value;
    emojiStyles[key] = { ...emojiStyles[key], invert: value };
    drawOnCanvas();
  };
  sepia.oninput = (e) => {
    const value = e.target.value;
    emojiStyles[key] = { ...emojiStyles[key], sepia: value };
    drawOnCanvas();
  };
  saturate.oninput = (e) => {
    const value = e.target.value;
    emojiStyles[key] = { ...emojiStyles[key], saturate: value };
    drawOnCanvas();
  };
  brightness.oninput = (e) => {
    const value = e.target.value;
    emojiStyles[key] = { ...emojiStyles[key], brightness: value };
    drawOnCanvas();
  };
  contrast.oninput = (e) => {
    const value = e.target.value;
    emojiStyles[key] = { ...emojiStyles[key], contrast: value };
    drawOnCanvas();
  };
}

function drawEmojiParts(parts) {
  const container = document.getElementById("emoji-parts");
  container.innerHTML = "";

  const { eye, mouth, face, hair } = parts;

  function createPart(item, key) {
    const div = document.createElement("div");
    div.className = "emoji-part";

    div.onclick = () => {
      emojiFace[key] = item.src;

      if (!emojiCustomiseStack.includes(key)) emojiCustomiseStack.push(key);

      drawOnCanvas();
      drawCustomize();
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
    elementContainer.className = "emoji-part-container";
    elements.forEach((el) => elementContainer.appendChild(el));
    div.appendChild(elementContainer);

    const remove = document.createElement("button");
    remove.classList.add("btn-remove");
    remove.innerText = "Remove";
    remove.onclick = () => {
      emojiFace[key] = null;
      emojiCustomiseStack = emojiCustomiseStack.filter((e) => e !== key);
      drawCustomize();
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

  Object.entries(emojiFace).forEach(([key, src]) => {
    if (!src) return;

    const img = document.createElement("img");
    img.src = src;
    img.className = "preview-emoji";

    const styles = emojiStyles[key];
    if (styles) {
      const styleString = Object.entries(styles)
        .map(([filterName, filterValue]) => {
          if (typeof filterValue === "string" && filterValue.length === 0)
            return null;

          return `${filterName}(${filterValue}%)`;
        })
        .filter((value) => value !== null)
        .join(" ");

      img.style.filter = styleString;
    }

    canvas.appendChild(img);
  });
}

async function loadEmojiPart() {
  const res = await fetch("/api/emoji-parts");
  const parts = await res.json();

  drawEmojiParts(parts);
  drawCustomize();
}
await loadEmojiPart();

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
    drawEmoji(container, emoji);
  });
}

await fetchAndDrawCreatedEmojies();

// Handle form submit.
const form = document.getElementById("create-emoji");

form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const description = formData.get("description");

  try {
    const res = await fetch("/api/create-emoji", {
      method: "POST",
      body: JSON.stringify({
        ...emojiFace,
        style: emojiStyles,
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

    emojiFace = { face: null, eye: null, mouth: null, hair: null };
    emojiStyles = { face: null, eye: null, mouth: null, hair: null };
    emojiCustomiseStack = [];
    drawCustomize();
    drawOnCanvas();
  } catch (e) {
    alert(`Failed to create emoji: ${e.message}`);
  }
};
