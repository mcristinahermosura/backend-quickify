const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required!"],
  },
  stock: {
    type: Number,
    required: [true, "Stock is required!"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
