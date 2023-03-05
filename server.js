const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const basicAuth = require("express-basic-auth");
const app = express();

const port = 3000;

function authFunction(username, password) {
  console.log(username, password);
  return true;
}

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use(
//   basicAuth({
//     authorizer: authFunction,
//     challenge: true,
//   })
// );

// Route to resources.
app.get("/resources/:resource", (req, res) => {
  const fileName = path.join(__dirname, `/resources/${req.params.resource}`);
  if (!fs.existsSync(fileName)) {
    res.sendStatus(404);
  } else {
    res.sendFile(fileName);
  }
});

// Route to other pages
app.get("/:page", (req, res) => {
  console.log(req.params.page);
  const fileName = path.join(__dirname, `/pages/${req.params.page}.html`);
  if (!fs.existsSync(fileName)) {
    res.sendFile(path.join(__dirname, "/pages/404.html"));
  } else {
    res.sendFile(fileName);
  }
});

app.get("/api/emojies", (req, res) => {
  const emojies = JSON.parse(fs.readFileSync("./emojies.json"));

  res.send(emojies);
});

app.post("/api/create-emoji", (req, res) => {
  // https://stackoverflow.com/a/67624847
  const id = crypto.randomUUID();

  const { face, mouth, eyes, hair, description, username } = req.body;

  const emojiToSave = {
    face,
    mouth,
    eyes,
    hair,
    description,
    username: username ?? "anonymous",
    time: new Date().toDateString(),
    id,
  };

  const emojies = JSON.parse(fs.readFileSync("./emojies.json"));
  emojies.push(emojiToSave);

  fs.writeFileSync("./emojies.json", JSON.stringify(emojies));

  res.sendStatus(200);
});

app.post("/api/sign-in", (req, res) => {
  const users = JSON.parse(fs.readFileSync("./users.json"));
  const username = req.body["username"];
  const password = req.body["password"];

  if (!username || !password) {
    res.status(400);
    res.send({ reason: "Invalid user input entered." });
    return;
  }
  const user = users.find((storedUser) => storedUser.username === username);

  if (user && user.password === password) {
    req.res.sendStatus(200);
  } else {
    res.status(401);
    res.send({ reason: "Failed to sign in. Does user exist?" });
  }
});

app.post("/api/sign-up", (req, res) => {
  const users = JSON.parse(fs.readFileSync("./users.json"));

  const username = req.body["username"];
  const password = req.body["password"];

  if (!username || !password) {
    res.status(400);
    res.send({ reason: "Invalid user input entered." });
    return;
  }

  const userExists = users.some(
    (storedUser) => storedUser.username === username
  );

  if (userExists) {
    res.status(400);
    res.send({ reason: "User already exists" });
    return;
  }

  users.push({ username, password });

  fs.writeFileSync("./users.json", JSON.stringify(users));
  res.sendStatus(200);
});

// Route to the home page.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/index.html"));
});

app.listen(port, () => {
  console.log(`Application started on http://localhost:${port}/`);
});
