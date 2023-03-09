const path = require("path");
const fs = require("fs");
const app = require("./app");
const crypto = require("crypto");

app.get("/api/emojie-parts", (_, res) => {
  const filename = path.join(__dirname, "../db/emojie-parts.json");
  res.send(JSON.parse(fs.readFileSync(filename)));
});

app.put("/api/emojies", (req, res) => {
  const { userSearch, dateSearch } = req.body;

  const filename = path.join(__dirname, "../db/emojies.json");
  let emojies = JSON.parse(fs.readFileSync(filename));

  if (userSearch) {
    emojies = emojies.filter((e) => e.username.includes(userSearch));
  }

  if (dateSearch) {
    emojies = emojies.filter((e) => {
      const date = new Date(e.time);
      const filterDate = new Date(dateSearch);

      return date >= filterDate;
    });
  }

  res.send(emojies);
});

app.get("/api/emojie/:id", (req, res) => {
  const filename = path.join(__dirname, "../db/emojies.json");
  const emojies = JSON.parse(fs.readFileSync(filename));

  const emojie = emojies.find((e) => e.id === req.params.id);

  if (emojie) {
    res.send(emojie);
  } else {
    res.send({});
  }
});

app.post("/api/create-emoji", (req, res) => {
  // https://stackoverflow.com/a/67624847
  const id = crypto.randomUUID();

  const { face, mouth, eye, hair, desc, username } = req.body;

  const emojiToSave = {
    face,
    mouth,
    eye,
    hair,
    desc,
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
