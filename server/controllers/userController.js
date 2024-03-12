const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../middleware/nodeMailer");
const asyncHandler = require("express-async-handler");

// =========reigster user -> /api/register/===========================
exports.userSignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are mandatory!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ success: true, message: "User registered!", user: newUser });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ success: false, message: "User registration failed!" });
  }
});
// =========login user -> /api/login/=================================
exports.userLogin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory!" });
    }

    // Find the user by email
    const existingUser = await User.findOne({ email });

    // Handle user not found
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User account not found!" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    // Handle password mismatch
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password!" });
    }
    //genrate token
    const token = jwt.sign({ user: existingUser }, process.env.SECRET_KEY);

    // If everything is fine, user is logged in
    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user: existingUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "User login failed!" });
  }
});
// =========get user -> /api/getUser/====================================
exports.getUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  const data = await User.findById(req.user._id);
  if (data) {
    return res.status(200).json({
      success: true,
      message: "data fetched successfully!",
      users: data,
    });
  } else {
    return res.status(404).json({ success: false, message: "data not found!" });
  }
});

// =========delete user -> /api/deleteUser/========================
exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.user._id });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "deleted successfully!",
        user,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: "failed to delete User!" });
  }
});

// =========update user -> /api/updateUser/========================
exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate({ _id: req.user._id },
      req.body,{new:true}
      );
    if (user) {
      return res.status(200).json({
        success: true,
        message: "updated successfully!",
        user,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: "failed to update user!" });
  }
});
//========================otp email verification====================
exports.otpToMail = async (req, res) => {
  try {
    
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const generatedOtp = () => Math.floor(100000 + Math.random() * 900000);
    let otp = generatedOtp();
    
    // Send email
    const mail = await sendEmail(
      req.body.email,
      "CONTACT APP VERIFY",
      `DONT SHARE THIS OTP **${otp}** TO ANYONE VAILD FOR 2 MINTS`
    );
    res.status(201).json({
      success: true,
      otp,
      message: "Successfully otp sent to email",
    });
  } catch (error) {
    console.error(error);

    let errorMessage = "Something went wrong while processing the request.";

    // Check specific errors
    if (error.code === "ENOENT") {
      errorMessage = "Error creating CSV file: File not found.";
    } else if (error.response && error.response.statusCode) {
      errorMessage = `Error sending email: ${error.response.statusCode}`;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
