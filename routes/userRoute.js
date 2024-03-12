const {
  userSignUp,
  userLogin,
  getUser,
  deleteUser,
  otpToMail,
  updateUser,
} = require("../controllers/userController");
const { tokenVerify } = require("../middleware/TokenVerify");

const router = require("express").Router();

// =============user Routes===================
router.route("/otp").post(otpToMail);
router.route("/register").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/getUser").get(tokenVerify, getUser);
router.route("/deleteUser").delete(tokenVerify, deleteUser);
router.route("/updateUser").put(tokenVerify, updateUser);

module.exports = router;
