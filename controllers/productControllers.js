const { RESPONSE_MESSAGE, RESPONSE_STATUS } = require("../constant/index.js");
const Product = require("../models/Product.js");

const fs = require("fs");
const path = require("path");

function removeImage(filename, callback) {
  const filePath = path.join(__dirname, "../uploads", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist");
      callback(false);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          callback(false);
        } else {
          console.log("File deleted successfully");
          callback(true);
        }
      });
    }
  });
}

module.exports.addProduct = async (request, response) => {
  try {
    const url = request.protocol + "://" + request.headers.host;
    const imageURL = url + "/files/" + request.file.filename;

    const { name, description, price, stock } = request.body;

    if (
      !name ||
      !description ||
      isNaN(price) ||
      price < 0 ||
      isNaN(stock) ||
      stock < 0
    ) {
      return response.status(400).json({
        error: "Name, description, price, and stock are required.",
        status: RESPONSE_STATUS.FAILED,
      });
    }
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image: {
        url: imageURL,
      },
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
    const url = request.protocol + "://" + request.headers.host;
    const imageURL = url + "/b4/files/" + request.file.filename;
    const productId = request.params.productId;
    const { name, description, price, stock } = request.body;

    const validationErrors = [];

    if (!name) {
      validationErrors.push("Name is required.");
    }
    if (!description) {
      validationErrors.push("Description is required.");
    }
    if (!price || isNaN(price) || price < 0) {
      validationErrors.push(
        "Price must be a non-negative number and not null."
      );
    }
    if (!stock || isNaN(stock) || stock < 0) {
      validationErrors.push(
        "Stock must be a non-negative number and not null."
      );
    }

    if (validationErrors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        status: RESPONSE_STATUS.FAILED,
        error: validationErrors,
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return response.status(400).json({
        message: `Can't find product with id of ${productId}`,
        status: RESPONSE_STATUS.FAILED,
      });
    }

    if (imageURL) {
      const filename = product.image.url.substring(
        product.image.url.lastIndexOf("/") + 1
      );
      if (product.image.url.length > 1) {
        removeImage(filename, (success) => {
          if (!success) {
            return response.status(400).json({
              message: "An error occured upon deleting the image!",
              status: RESPONSE_STATUS.FAILED,
            });
          }
        });
      }

      product.image = {
        url: imageURL,
      };
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.updatedAt = new Date();

    const updatedProduct = await product.save();

    if (updatedProduct) {
      return response.status(200).json({
        message: RESPONSE_MESSAGE.PRODUCT_UPDATED_SUCCESS,
        status: RESPONSE_STATUS.SUCCESS,
        data: updatedProduct,
      });
    } else {
      return response.status(400).json({
        message: RESPONSE_MESSAGE.PRODUCT_UPDATE_FAILED,
        status: RESPONSE_STATUS.FAILED,
      });
    }
  } catch (error) {
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
      updatedAt: new Date(),
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
