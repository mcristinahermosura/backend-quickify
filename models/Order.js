const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required!"],
  },
  orders: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required!"],
      },
      image: {
        type: String,
        default: "",
      },
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required!"],
      },
      price: {
        type: Number,
        required: [true, "Price is required!"],
      },
      total: {
        type: Number,
        required: [true, "Total is required!"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total Amount is required!"],
  },
  shippingAddress: {
    type: String,
    required: [true, "Shipping Address is required!"],
  },
  paymentMethod: {
    type: String,
    default: "Cash On Delivery",
    required: [true, "Payment Method is required!"],
  },
  orderStatus: {
    type: String,
    default: "Pending",
    required: [true, "Order Status is required!"],
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

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
