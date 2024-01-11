const express = require("express")
const orderControllers = require("../controllers/orderControllers")
const userAuth = require("../userAuth.js")
const { verify, verifyAdmin } = userAuth;
const router = express.Router()

router.post("/checkout", verify, orderControllers.userCheckout)

router.get("/retrieveAllOrders", verify, verifyAdmin, orderControllers.getAllOrders)


module.exports = router;