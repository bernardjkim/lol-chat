require("dotenv").config();
const fs = require("fs");

fs.writeFile(
  "./google-credentials-heroku.json",
  process.env.GOOGLE_CONFIG1 +
    process.env.GOOGLE_CONFIG2 +
    process.env.GOOGLE_CONFIG3,
  err => {}
);
