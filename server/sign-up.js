const app = require("./app");
const path = require("path");
const fs = require("fs");

app.post("/api/sign-in", (req, res) => {
  const fileName = path.join(__dirname, "../db/users.json");
  const users = JSON.parse(fs.readFileSync(fileName));

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
  const fileName = path.join(__dirname, "../db/users.json");
  const users = JSON.parse(fs.readFileSync(fileName));

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

  fs.writeFileSync(fileName, JSON.stringify(users, null, 2));
  res.sendStatus(200);
});
