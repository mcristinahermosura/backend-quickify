const express = require("express");
const orderControllers = require("../controllers/orderControllers");
const userAuth = require("../userAuth.js");
const { verify, verifyAdmin } = userAuth;
const router = express.Router();

router.post("/checkout", verify, orderControllers.userCheckout);

router.get("/all", verify, verifyAdmin, orderControllers.getAllOrders);

router.get("/:userId", verify, orderControllers.getUserOrder);

router.patch("/cancel-order", verify, orderControllers.cancelOrder);

router.patch(
  "/update-status",
  verify,
  verifyAdmin,
  orderControllers.updateOrderStatus
);

router.delete(
  "/delete/:orderId",
  verify,
  verifyAdmin,
  orderControllers.deleteOrder
);

module.exports = router;
