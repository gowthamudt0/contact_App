const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const contactRoute = require("./routes/contactRoute");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", contactRoute);

module.exports = app;
