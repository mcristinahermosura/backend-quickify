const express = require("express");
const orderControllers = require("../controllers/orderControllers");
const userAuth = require("../userAuth.js");
const { verify, verifyAdmin } = userAuth;
const router = express.Router();

router.post("/checkout", verify, orderControllers.userCheckout);

router.get("/:userId", verify, orderControllers.getUserOrder);

router.get("/all", verify, verifyAdmin, orderControllers.getAllOrders);

router.put("/cancel-order", verify, orderControllers.cancelOrder);

router.put(
  "/update-status",
  verify,
  verifyAdmin,
  orderControllers.updateOrderStatus
);

module.exports = router;
