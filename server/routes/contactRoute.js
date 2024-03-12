const contact = require("../controllers/contactsController");

const {tokenVerify} = require("../middleware/TokenVerify");
const router = require("express").Router();

// =======================contact Routes===============================
router.route("/createContact").post(tokenVerify, contact.CreateContact);
router.route("/getContacts").get(tokenVerify, contact.getContacts);
router.route("/updateContact/:id").put(tokenVerify, contact.updateContact);
router.route("/deleteContact/:id").delete(tokenVerify, contact.deleteContact);

module.exports = router;
