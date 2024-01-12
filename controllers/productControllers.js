const userAuth = require("../userAuth.js");
const Product = require("../models/Product.js");
const Order = require("../models/Order.js");

module.exports.addProduct = (request, response) => {
  let reqBody = request.body;

  if (!reqBody.name || !reqBody.description || !reqBody.price) {
    return response.status(400).json({
      message: "Name, description, and price are required.",
    });
  }

  const newProduct = new Product({
    name: reqBody.name,
    description: reqBody.description,
    price: reqBody.price,
  });

  newProduct
    .save()
    .then((save) => {
      return response
        .status(201)
        .json({ message: `Product added successfully!` });
    })
    .catch((error) => {
      return response.status(400).json({
        message: `Failed to add the product. An error occurred during the process. Please try again later.`,
      });
    });
};

module.exports.getAllProducts = (request, response) => {
  Product.find({})
    .then((result) => response.status(200).json(result))
    .catch((error) =>
      response.status(400).json({
        message: `Failed to retrieve all products. An error occurred during the process. Please try again later.`,
      })
    );
};

module.exports.getAllActiveProducts = (request, response) => {
  Product.find({ isActive: true })
    .then((result) => response.status(200).json(result))
    .catch((error) =>
      response.status(400).json({
        message: `Failed to retrieve all active products. An error occurred during the process. Please try again later.`,
      })
    );
};

module.exports.getSingleProduct = (request, response) => {
  const reqParams = request.params.productId;

  Product.findById(reqParams)
    .then((result) => response.status(200).json(result))
    .catch((error) =>
      response.status(400).json({
        message: `Failed to retrieve the products. An error occurred during the process. Please try again later.`,
      })
    );
};

module.exports.updatedProduct = (request, response) => {
  const reqParams = request.params.productId;
  const reqBody = request.body;

  if (!reqBody.name || !reqBody.description || !reqBody.price) {
    return response.status(400).send({
      message: "Name, description, and price are required.",
    });
  }

  const updatedProduct = {
    name: reqBody.name,
    description: reqBody.description,
    price: reqBody.price,
  };
  Product.findByIdAndUpdate(reqParams, updatedProduct)
    .then((result) => {
      if (result) {
        return response
          .status(200)
          .json({ message: `Product updated successfully!` });
      } else {
        return response.status(400).json({
          message: `Failed to update the product. An error occurred during the process. Please try again later.`,
        });
      }
    })
    .catch((error) => response.send(error));
};

module.exports.archiveProduct = (request, response) => {
  const modifyActiveField = { isActive: false };

  Product.findByIdAndUpdate(request.params.productId, modifyActiveField)
    .then((result) => {
      if (result) {
        return response
          .status(200)
          .json({ message: `Product successfully deactivated!` });
      } else {
        return response.status(400).json({
          message: `Failed to deactivate the product. An error occurred during the process. Please try again later!`,
        });
      }
    })
    .catch((error) => response.send(error));
};

module.exports.activateProduct = (request, response) => {
  const modifyActiveField = { isActive: true };

  Product.findByIdAndUpdate(request.params.productId, modifyActiveField)
    .then((result) => {
      if (result) {
        return response
          .status(200)
          .json({ message: `Product successfully activated!` });
      } else {
        return response.status(400).json({
          message: `Failed to activate the product. An error occurred during the process. Please try again later!`,
        });
      }
    })
    .catch((error) => response.send(error));
};
