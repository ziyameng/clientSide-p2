const browserEl = document.getElementById("browser-emojies");

async function displayEmojies() {
  const emojies = await fetch("/api/emojies").then((res) => res.json());

  console.log(browserEl);

  const emojieElements = [];
  for (const emo of emojies) {
    const container = document.createElement("div");
    container.className = "browser-emojie-container";
    container.innerHTML = `
    <div class="browser-emoji-images">
      ${emo.face ? `<img src="${emo.face}" />` : ""}
      ${emo.mouth ? `<img src="${emo.mouth}" />` : ""}
      ${emo.eyes ? `<img src=${emo.eyes} />` : ""}
      ${emo.hair ? `<img src=${emo.hair} />` : ""}
    </div>
    <div>
      <div>${emo.username}</div>
      <div>${emo.time}</div>
      <div>${emo.description}</div>
    </div>
    `;

    emojieElements.push(container);
  }

  emojieElements.forEach((el) => browserEl.appendChild(el));
}

displayEmojies();
