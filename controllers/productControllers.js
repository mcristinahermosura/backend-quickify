const { RESPONSE_MESSAGE, RESPONSE_STATUS } = require("../constant/index.js");
const Product = require("../models/Product.js");

module.exports.addProduct = async (request, response) => {
  try {
    const { name, description, price, quantity } = request.body;

    if (!name || !description || !price || !quantity) {
      return response.status(400).json({
        error: "Name, description, price, and quantity are required.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
    });

    const createdProduct = await newProduct.save();

    if (!createdProduct) {
      return response.status(400).json({
        error: RESPONSE_MESSAGE.PRODUCT_CREATE_FAILED,
        status: RESPONSE_STATUS.FAILED,
      });
    }

    return response.status(201).json({
      message: RESPONSE_MESSAGE.PRODUCT_CREATED_SUCCESS,
      status: RESPONSE_STATUS.SUCCESS,
      data: createdProduct,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: RESPONSE_MESSAGE.ERROR_OCCURRED,
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.getAllProducts = async (request, response) => {
  try {
    const products = await Product.find({});
    return response.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Failed to retrieve all products. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.getAllActiveProducts = async (request, response) => {
  try {
    const products = await Product.find({ isActive: true });
    return response.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Failed to retrieve active products. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.getSingleProduct = async (request, response) => {
  try {
    const productId = request.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: `Product with id ${productId} not found.`,
        status: RESPONSE_STATUS.FAILED,
      });
    }
    return response.status(200).json({
      message: `Product with id ${productId} retrieved successfully.`,
      status: RESPONSE_STATUS.SUCCESS,
      data: product,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: RESPONSE_MESSAGE.ERROR_OCCURRED,
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.updateProduct = async (request, response) => {
  try {
    const productId = request.params.productId;
    const { name, description, price, stock } = request.body;

    if (!name || !description || !price || !stock) {
      return response.status(400).json({
        message: "Name, description, price, and stock are required.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const updatedProduct = {
      name,
      description,
      price,
      stock,
    };

    const result = await Product.findByIdAndUpdate(productId, updatedProduct);

    if (result) {
      return response.status(200).json({
        message: RESPONSE_MESSAGE.PRODUCT_UPDATED_SUCCESS,
        status: RESPONSE_STATUS.SUCCESS,
        data: result,
      });
    } else {
      return response.status(400).json({
        message: RESPONSE_MESSAGE.PRODUCT_UPDATE_FAILED,
        status: RESPONSE_STATUS.FAILED,
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: RESPONSE_MESSAGE.ERROR_OCCURRED,
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.updateProductStatus = async (request, response) => {
  try {
    const productId = request.params.productId;
    const { isActive } = request.body;

    if (isActive === undefined) {
      return response.status(400).json({
        message: "isActive field is required.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const result = await Product.findByIdAndUpdate(productId, {
      isActive: isActive,
    });

    if (result) {
      return response.status(200).json({
        message: "Product status updated successfully!",
        data: result,
        status: RESPONSE_STATUS.SUCCESS,
      });
    } else {
      return response.status(400).json({
        message: "Failed to update the product status. Please try again later.",
        status: RESPONSE_STATUS.FAILED,
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: RESPONSE_MESSAGE.ERROR_OCCURRED,
      status: RESPONSE_STATUS.ERROR,
    });
  }
};
