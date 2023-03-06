export function drawEmojie(container, emoji, noClick) {
  const div = document.createElement("div");
  div.className = "browser-item";

  // Navigate to indiviual emojie component
  if (!noClick) {
    div.onclick = () => {
      window.location.href = `/emojie?id=${emoji.id}`;
    };
  }

  const canvas = document.createElement("div");
  canvas.style.position = "relative";
  canvas.style.height = `200px`;
  canvas.style.width = `200px`;

  const imgs = [emoji.face, emoji.eye, emoji.mouth, emoji.hair];
  imgs.forEach((src) => {
    if (!src) return;

    const img = document.createElement("img");
    img.style.position = "absolute";
    img.src = src;
    img.width = 200;
    img.height = 200;

    canvas.appendChild(img);
  });

  div.appendChild(canvas);

  const name = document.createElement("p");
  name.innerText = "created by " + emoji.username + " on " + emoji.time;
  div.appendChild(name);

  container.appendChild(div);
}
