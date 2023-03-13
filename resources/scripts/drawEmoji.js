export function drawEmoji(container, emoji, noClick) {
  const div = document.createElement("div");
  div.className = "browser-item";

  // Navigate to indiviual emoji component
  if (!noClick) {
    div.onclick = () => {
      window.location.href = `/emoji?id=${emoji.id}`;
    };
  }

  const canvas = document.createElement("div");
  canvas.style.position = "relative";
  canvas.style.height = `200px`;
  canvas.style.width = `200px`;

  const imgs = [
    ["face", emoji.face],
    ["eye", emoji.eye],
    ["mouth", emoji.mouth],
    ["hair", emoji.hair],
  ];
  imgs.forEach(([key, src]) => {
    if (!src) return;

    const img = document.createElement("img");
    img.style.position = "absolute";
    img.src = src;
    img.width = 200;
    img.height = 200;

    const styles = emoji.style[key];
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

  div.appendChild(canvas);

  const name = document.createElement("p");
  name.innerText = "created by " + emoji.username + " on " + emoji.time;
  div.appendChild(name);

  if (emoji.desc) {
    const desc = document.createElement("p");
    desc.innerText = emoji.desc;
    div.appendChild(desc);
  }

  container.appendChild(div);
}
