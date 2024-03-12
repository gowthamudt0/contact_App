const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((db) => console.log(`mongodb connected on ${db.connection.host} `))
    .catch((err) => console.log(`database connection error ${err}`));
};

module.exports = database;
