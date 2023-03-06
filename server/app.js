const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());
// Load static resources
app.use("/resources", express.static(path.join(__dirname, "../resources")));

app.get("/:page", (req, res) => {
  const fileName = path.join(__dirname, `../pages/${req.params.page}.html`);
  if (!fs.existsSync(fileName)) {
    res.sendFile(path.join(__dirname, "../pages/404.html"));
  } else {
    res.sendFile(fileName);
  }
});

// Route to the home page.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/index.html"));
});

module.exports = app;
