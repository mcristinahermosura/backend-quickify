const express = require("express");
const productControllers = require("../controllers/productControllers.js");
const userAuth = require("../userAuth.js");
const router = express.Router();
const { verify, verifyAdmin } = userAuth;

router.post("/", verify, verifyAdmin, productControllers.addProduct);
router.get("/retrieveAllProduct", productControllers.getAllProducts);
router.get("/allActive", productControllers.getAllActiveProducts);
router.get("/retrieve/:productId", productControllers.getSingleProduct);
router.put(
  "/update/:productId",
  verify,
  verifyAdmin,
  productControllers.updatedProduct
);
router.put(
  "/archive/:productId",
  verify,
  verifyAdmin,
  productControllers.archiveProduct
);
router.put(
  "/activate/:productId/",
  verify,
  verifyAdmin,
  productControllers.activateProduct
);

module.exports = router;
