// Must be signed in to upload an image.
if (!localStorage.getItem("username")) window.location.href = "/sign-in";

const upload = document.getElementById("file-upload");

// https://stackoverflow.com/a/8471438
const sizeInMB = (sizeInBytes) => (sizeInBytes / (1024 * 1024)).toFixed(2);
const MAX_SIZE = 400_000;

let width = 0;
let height = 0;
let dataUrl;
// https://stackoverflow.com/a/8904008
// https://stackoverflow.com/a/20285053
upload.onchange = function () {
  const file = this.files[0];
  const img = new Image();
  const objectURL = URL.createObjectURL(file);

  const reader = new FileReader();
  reader.onloadend = function () {
    dataUrl = reader.result;
  };
  reader.readAsDataURL(file);

  img.onload = function () {
    width = this.width;
    height = this.height;

    drawPreview(img, file.size);
  };
  img.src = objectURL;
};

function drawPreview(img, size) {
  const statsContainer = document.getElementById("preview-stats");

  let sizeCheck = ``;
  if (size > MAX_SIZE) {
    sizeCheck = `Max size is ${sizeInMB(MAX_SIZE)}mb, image is ${sizeInMB(
      size
    )}mb`;
  }

  statsContainer.innerHTML = `
    <div class="preview">
      <img src="${img.src}" width="200" height="200" />
    </div>
    <div>
      <span>Width: ${
        width !== 200 ? `width is too high ${width}` : width
      }</span>
      <span>Height: ${
        height !== 200 ? `width is too high ${height}` : height
      }</span>
    </div>
    <div>
      ${sizeCheck}
    </div>
  `;

  if (width === 200 && height === 200 && size < MAX_SIZE) {
    const btn = document.getElementById("btn-submit");
    btn.disabled = false;
  }
}

const form = document.getElementById("upload-form");
form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const description = formData.get("description");
  const type = formData.get("type");

  const username = localStorage.getItem("username");
  const pass = localStorage.getItem("password");
  try {
    await fetch("/api/emojie-part", {
      method: "POST",
      body: JSON.stringify({
        dataUrl,
        description,
        type,
        username,
        time: new Date().toTimeString(),
      }),
      headers: new Headers({
        Authorization: `Basic ${btoa(`${username}:${pass}`)}`,
        "Content-type": "application/json; chartset=UTF-8",
      }),
    });

    window.location.href = "/";
  } catch {
    alert("Failed to upload file");
  }
  console.log(description, type);

  console.log(dataUrl);
};
