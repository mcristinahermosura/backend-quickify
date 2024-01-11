const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");
const userAuth = require("../userAuth.js");
//     const user = request.user;
//     const productId = request.body.productId;

//     if(user.isAdmin){
//         return response.send({message: `Action Forbidden: You do not have the necessary permissions to perform this action!`});
//     }

//     const isOrderUpdated = await User.findById(user.Id).then(result =>{

//         const newProduct = {
//             productId: productId
//         }

//         result.product.push(newProduct);

//         return result.save().then(saved => true).catch(error=> false);

//     })

//     if(isOrderUpdated !== true){
//         return response.send({message: `Failed to update order!`})
//     }

// };

module.exports.userCheckout = async (request, response) => {
  try {
    // Extract order details from the request body
    const { userId, products, totalAmount } = request.body;

    // Create a new order instance
    const newOrder = new Order({
      userId,
      products,
      totalAmount,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    response
      .status(201)
      .json({ message: `Order created successfully!`, order: savedOrder });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

module.exports.getAllOrders = (request, response) => {
    Order.find({})
      .then((result) => response.status(400).json(result))
      .catch((error) =>
        response.send({
          message: `Failed to retrieve all orders. An error occurred during the process. Please try again later.`,
        })
      );
  };