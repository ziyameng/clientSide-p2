const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const port = 3000;

// Route to the home page.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/index.html"));
});

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
  const fileName = path.join(__dirname, `/assets/${req.params.page}.html`);
  if (!fs.existsSync(fileName)) {
    res.sendFile(path.join(__dirname, "/assets/404.html"));
  } else {
    res.sendFile(fileName);
  }
});

// Create a new user - for testing
app.post("/api/new-user", (req, res) => {
  res.send(JSON.stringify({ x: 123 }));
});

app.listen(port, () => {
  console.log(`Application started on http://localhost:${port}/`);
});
