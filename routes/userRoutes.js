const express = require("express");
const userControllers = require("../controllers/userControllers.js");
const userAuth = require("../userAuth.js");
const router = express.Router();
const { verify, verifyAdmin } = userAuth;

router.post(
  "/signUp",
  userControllers.verifyEmailExists,
  userControllers.registerUser
);
router.post("/login", userControllers.loginUser);
router.get("/userDetails", verify, userControllers.getUserInfo);

module.exports = router;
