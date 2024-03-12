const dotenv = require("dotenv").config();
const app = require("./app");
const db = require("./config/database");

db();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}..`);
});
