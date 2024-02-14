const { RESPONSE_STATUS } = require("../constant/index.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");

module.exports.userCheckout = async (request, response) => {
  try {
    const { userId, orders, totalAmount, shippingAddress, paymentMethod } =
      request.body;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return response.status(400).json({
        message: `User with ID ${userId} does not exist.`,
        status: RESPONSE_STATUS.FAILED,
      });
    }
    if (
      !userId ||
      !orders ||
      !totalAmount ||
      !shippingAddress ||
      !paymentMethod
    ) {
      return response.status(400).json({
        message: "Missing required properties in the request body.",
        status: RESPONSE_STATUS.FAILED,
        data: {
          userId: !userId ? "User ID is required." : undefined,
          orders: !orders ? "Orders are required." : undefined,
          totalAmount: !totalAmount ? "Total amount is required." : undefined,
          shippingAddress: !shippingAddress
            ? "Shipping address is required."
            : undefined,
          paymentMethod: !paymentMethod
            ? "Payment method is required."
            : undefined,
        },
      });
    }

    let validatedOrders = [];

    for (const order of orders) {
      const { productId, quantity, price, total } = order;

      const product = await Product.findById(productId);
      if (!productId || !quantity || !price || !total) {
        return response.status(400).json({
          message: "Missing required properties in the request body.",
          status: RESPONSE_STATUS.FAILED,
          data: {
            productId: !productId ? "Product ID is required." : undefined,
            quantity: !quantity ? "Quantity is required." : undefined,
            price: !price ? "Price is required." : undefined,
            total: !total ? "Total is required." : undefined,
          },
        });
      }

      if (!product) {
        return response.status(400).json({
          message: `Product with ID ${productId} does not exist.`,
          status: RESPONSE_STATUS.FAILED,
        });
      }

      const { _id, name } = product;

      product.stock -= quantity;
      const updateStockRes = await product.save();

      if (!updateStockRes) {
        return response.status(400).json({
          message: "Failed to update product stock.",
          status: RESPONSE_STATUS.FAILED,
        });
      }

      validatedOrders.push({
        productId: _id,
        productName: name,
        quantity,
        price,
        total,
      });
    }

    const newOrder = new Order({
      userId,
      orders: validatedOrders,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await newOrder.save();

    if (!savedOrder) {
      return response.status(400).json({
        message: "Failed to create order. Please try again later.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    response.status(201).json({
      message: "Order created successfully!",
      order: savedOrder,
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

module.exports.getAllOrders = async (request, response) => {
  try {
    const orders = await Order.find({});

    if (orders.length === 0) {
      return response
        .status(404)
        .json({ message: "No orders found.", status: RESPONSE_STATUS.FAILED });
    }

    const ordersWithEmail = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById({ _id: order.userId });
        const { email } = user;
        return { ...order._doc, email };
      })
    );

    response.status(200).json({
      data: ordersWithEmail,
      message:
        ordersWithEmail.length === 0
          ? "No orders found."
          : "All orders retrieved successfully.",
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to retrieve all orders. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.getUserOrder = async (request, response) => {
  try {
    const { userId } = request.params;

    const userOrders = await Order.find({ userId });

    if (userOrders.length === 0) {
      return response
        .status(404)
        .json({ message: "User orders not found.", status: "failed" });
    }

    response.status(200).json({
      data: userOrders,
      message: "User orders found.",
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to retrieve user orders.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.cancelOrder = async (request, response) => {
  try {
    const { orderId } = request.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return response.status(404).json({ message: "Order not found." });
    }

    if (order.orderStatus === "Cancelled") {
      return response.status(400).json({
        error: "Order is already cancelled.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    for (const order of order.orders) {
      const product = await Product.findById(order.productId);
      product.stock += order.quantity;
      const updateStockRes = await product.save();

      if (!updateStockRes) {
        return response.status(400).json({
          message: "Failed to update product stock.",
          status: RESPONSE_STATUS.FAILED,
        });
      }
    }

    order.orderStatus = "Cancelled";
    order.updatedAt = new Date();
    await order.save();

    return response.status(200).json({
      data: order,
      message: "Order cancelled successfully.",
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to cancel order.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.updateOrderStatus = async (request, response) => {
  try {
    const { orderId, orderStatus } = request.body;

    const order = await Order.findById({ _id: orderId });

    if (!order) {
      return response
        .status(404)
        .json({ message: "Order not found.", status: RESPONSE_STATUS.FAILED });
    }

    if (order.orderStatus === "Cancelled") {
      return response.status(400).json({
        error: "Order cannot be updated because it is already cancelled.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const validationResult = order.validateSync();

    if (validationResult) {
      return response.status(400).json({
        error: validationResult.name,
        status: RESPONSE_STATUS.FAILED,
        message: validationResult.message,
      });
    }

    order.orderStatus = orderStatus;
    order.updatedAt = new Date();

    await order.save();

    return response.status(200).json({
      data: order,
      message: "Order status updated successfully.",
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to update order status.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};
