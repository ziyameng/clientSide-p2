const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const securedRoutes = require("express").Router();
const app = require("./app");
const basicAuth = require("express-basic-auth");

// https://stackoverflow.com/a/33905671
securedRoutes.use((req, res, next) => {
  // parse login and password from headers
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [username, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");

  const filename = path.join(__dirname, "../db/users.json");
  const users = JSON.parse(fs.readFileSync(filename));

  const auth = users.find((u) => u.username === username) ?? {};

  // Verify login and password are set and correct
  if (
    username &&
    password &&
    username === auth.username &&
    password === auth.password
  ) {
    return next();
  }

  // Access denied...
  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
});

securedRoutes.delete("/api/emojies/:id", (req, res) => {
  const id = req.params.id;

  const emojiFile = path.join(__dirname, "../db/emojies.json");
  const commentsFile = path.join(__dirname, "../db/comments.json");

  const emojies = JSON.parse(fs.readFileSync(emojiFile));
  const comments = JSON.parse(fs.readFileSync(commentsFile));

  fs.writeFileSync(
    emojiFile,
    JSON.stringify(
      emojies.filter((e) => e.id !== id),
      null,
      2
    )
  );

  delete comments[id];
  fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

  res.sendStatus(200);
});

securedRoutes.post("/api/emoji-part", async (req, res) => {
  const filename = path.join(__dirname, "../db/emoji-parts.json");
  const parts = JSON.parse(fs.readFileSync(filename));

  const { type, description, username, time, dataUrl } = req.body;

  const bytes = dataURLtoUint(dataUrl);

  const folder = {
    eye: "/resources/eyes",
    face: "/resources/faces",
    hair: "/resources/hair",
    mouth: "/resources/mouth",
  }[type];

  const emojiPngFileName = crypto.randomUUID() + ".png";

  const pathToSave = path.join(__dirname, "../", folder, emojiPngFileName);

  fs.writeFileSync(pathToSave, bytes);
  const resourceUrl = path.join(folder, emojiPngFileName);

  parts[type].push({ src: resourceUrl, desc: description, username, time });
  fs.writeFileSync(filename, JSON.stringify(parts));

  res.sendStatus(200);
});

app.use("/", securedRoutes);

// https://stackoverflow.com/a/30407840
function dataURLtoUint(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return u8arr;
}
