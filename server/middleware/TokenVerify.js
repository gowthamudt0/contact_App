const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.tokenVerify = asyncHandler(async (req, res, next) => {
  let token;

  const authorization = req.headers.authorization || req.headers.Authorization;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];

    try {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(404).json({
        success: false,
        message: "Oops! Something went wrong. Please try logging in again.",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "Authentication failed. Please log in to get access.",
    });
  }
});
