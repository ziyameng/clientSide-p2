const path = require("path");
const fs = require("fs");
const app = require("./app");

app.get("/api/emojie-parts", (_, res) => {
  const filename = path.join(__dirname, "../db/emojie-parts.json");
  res.send(JSON.parse(fs.readFileSync(filename)));
});

app.get("/api/emojies", (_, res) => {
  const filename = path.join(__dirname, "../db/emojies.json");
  const emojies = JSON.parse(fs.readFileSync(filename));

  res.send(emojies);
});

app.post("/api/create-emoji", (req, res) => {
  // https://stackoverflow.com/a/67624847
  const id = crypto.randomUUID();

  const { face, mouth, eye, hair, description, username } = req.body;

  const emojiToSave = {
    face,
    mouth,
    eye,
    hair,
    description,
    username: username ?? "anonymous",
    time: new Date().toDateString(),
    id,
  };

  const filename = path.join(__dirname, "../db/emojies.json");
  const emojies = JSON.parse(fs.readFileSync(filename));

  emojies.push(emojiToSave);

  fs.writeFileSync(filename, JSON.stringify(emojies, null, 2));
  res.sendStatus(200);
});
