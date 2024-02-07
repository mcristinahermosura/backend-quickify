const express = require("express");
const productControllers = require("../controllers/productControllers.js");
const userAuth = require("../userAuth.js");
const router = express.Router();
const { verify, verifyAdmin } = userAuth;

router.post("/", verify, verifyAdmin, productControllers.addProduct);
router.get("/all", productControllers.getAllProducts);
router.get("/all-active", productControllers.getAllActiveProducts);
router.get("/:productId", productControllers.getSingleProduct);
router.put(
  "/update/:productId",
  verify,
  verifyAdmin,
  productControllers.updateProduct
);
router.put(
  "/update-status/:productId",
  verify,
  verifyAdmin,
  productControllers.updateProductStatus
);

module.exports = router;
