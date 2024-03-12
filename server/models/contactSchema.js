const mongoose = require("mongoose");

const contacts = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, "user id is mandatory"],
  },
  name: {
    type: String,
    required: [true, "please enter contact name"],
  },
  phone: {
    type: String,
    required: [true, "please enter mobile number"],
  },
  phone1: {
    type: String,
  },
});

module.exports = mongoose.model("Contact", contacts);
