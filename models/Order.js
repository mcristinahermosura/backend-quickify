const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required!"],
  },
  products: [
    {
      productId: {
        type: String,
        required: [true, "product is required!"],
      },
      quantity: {
        type: Number,
        required: [true, "Number is required!"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total Amount is required!"],
  },
  purchasedOn: {
    type: Date,
    default: new Date(),
  },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
