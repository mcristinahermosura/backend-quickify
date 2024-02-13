const express = require("express");
const userControllers = require("../controllers/userControllers.js");
const userAuth = require("../userAuth.js");
const router = express.Router();
const { verify, verifyAdmin } = userAuth;

router.get("/", verifyAdmin, userControllers.getAllUsers);
router.post("/sign-up", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get("/details", verify, userControllers.getUserInfo);
router.put("/update", verify, verifyAdmin, userControllers.updateUser);

module.exports = router;
