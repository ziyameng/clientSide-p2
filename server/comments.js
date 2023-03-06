const path = require("path");
const fs = require("fs");
const app = require("./app");

app.get("/api/comments/:id", (req, res) => {
  const filename = path.join(__dirname, "../db/comments.json");
  const comments = JSON.parse(fs.readFileSync(filename));

  const commentsForId = comments[req.params.id] ?? [];

  res.send(commentsForId);
});

app.post("/api/comments", (req, res) => {
  const { id, comment } = req.body;
  const filename = path.join(__dirname, "../db/comments.json");
  const comments = JSON.parse(fs.readFileSync(filename));

  if (!comments[id]) comments[id] = [];
  comments[id].push(comment);

  fs.writeFileSync(filename, JSON.stringify(comments, null, 2));
  res.sendStatus(200);
});
