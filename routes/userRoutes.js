const express = require("express");
const userControllers = require("../controllers/userControllers.js");
const userAuth = require("../userAuth.js");
const router = express.Router();
const { verify, verifyAdmin } = userAuth;

router.post(
  "/sig-up",
  userControllers.registerUser
);
router.post("/login", userControllers.loginUser);
router.get("/details", verify, userControllers.getUserInfo);

module.exports = router;
