const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const app = require("./app");

require("./sign-up");
require("./api");
require("./comments");

const port = 3000;
app.listen(port, () => {
  console.log(`Application started on http://localhost:${port}/`);
});
