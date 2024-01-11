const User = require("../models/User.js");
const Product = require("../models/Product.js");
const Order = require("../models/Order.js");
const bcrypt = require("bcrypt");
const userAuth = require("../userAuth.js");

// Helper Function on finding the user by its ID
const getUser = async (id) => {
  const user = await User.findById(id);
  return { id: user._id, email: user.email, isAdmin: user.isAdmin };
};

module.exports.verifyEmailExists = (request, response, next) => {
  const reqBody = request.body;

  if (!reqBody.email || !reqBody.password) {
    return response.status(400).send({
      message: "Both email and password are required",
    });
  }

  User.find({ email: reqBody.email })
    .then((result) => {
      if (result.length > 0) {
        return response.status(400).json({
          message: `Thank you for your interest! It seems that the provided email address is already registered in our system. Please use another email`,
        });
      } else {
        next();
      }
    })
    .catch((error) =>
      response.send({
        message: `We apologize for the inconvenience, but an error occurred during the email verification process.!`,
      })
    );
};


module.exports.registerUser = (request, response) => {
  const reqBody = request.body;

  const newUser = new User({
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 10),
  });

  newUser
    .save()
    .then((save) => {
      return response.status(200).json({
        message: `User with email address ${reqBody.email} is now successfully registered!`,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        message: `We regret to inform you that an error occurred during the registration process.`,
      });
    });
};
module.exports.loginUser = (request, response) => {
  const reqBody = request.body;

  if (!reqBody.email || !reqBody.password) {
    return response.status(400).send({
      message: "Both email and password are required.",
    });
  }

  User.findOne({ email: reqBody.email }).then((result) => {
    if (result === null) {
      return response.status(400).json({
        message: `Invalid login attempt. The provided email does not exist. Please register before attempting to log in!`,
      });
    } else {
      const isValidPassword = bcrypt.compareSync(
        reqBody.password,
        result.password
      );

      if (isValidPassword) {
        const token = userAuth.generateAccessToken(result);
        return response.send({ accessToken: token });
      } else {
        return response.status(400).json({
          message: `Invalid password. Please provide the correct password and try again.`,
        });
      }
    }
  });
};

module.exports.getUserInfo = (request, response) => {
  const user = request.user;

  User.findById(user.id)
    .then((result) => {
      result.password = "";
      return response.send(result);
    })
    .catch((error) =>
      response.status(400).json({
        message: `There was an error encounter during the retrieval!`,
      })
    );
};
