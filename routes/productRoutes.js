const express = require("express");
const productControllers = require("../controllers/productControllers.js");
const userAuth = require("../userAuth.js");
const router = express.Router();
const { verify, verifyAdmin } = userAuth;
const { processFile } = require("../middleware/middleware.js");

router.post(
  "/",
  verify,
  verifyAdmin,
  processFile,
  productControllers.addProduct
);

router.get("/all", productControllers.getAllProducts);

router.get("/all-active", productControllers.getAllActiveProducts);

router.get("/:productId", productControllers.getSingleProduct);

router.put(
  "/update/:productId",
  verify,
  verifyAdmin,
  processFile,
  productControllers.updateProduct
);

router.patch(
  "/update-status/:productId",
  verify,
  verifyAdmin,
  productControllers.updateProductStatus
);

router.delete(
  "/delete/:productId",
  verify,
  verifyAdmin,
  productControllers.deleteProduct
);

module.exports = router;
