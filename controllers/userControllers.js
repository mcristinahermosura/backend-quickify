const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const userAuth = require("../userAuth.js");

const checkEmailExists = async (email) => {
  return await User.findOne({ email });
};

module.exports.registerUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    const existingUser = await checkEmailExists(reqBody.email);

    if (!email || !password) {
      return response.status(400).json({
        message: "Both email and password are required.",
      });
    }

    if (existingUser) {
      return response.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    const newUser = new User({
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 10),
    });

    const isUserCreated = await newUser.save();

    if (!isUserCreated) {
      return response.status(400).json({
        message: "Failed to register the user. Please try again later.",
      });
    }

    return response.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "An error occurred during registration. Please try again later.",
    });
  }
};

module.exports.loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({
        message: "Both email and password are required.",
      });
    }

    const user = await checkEmailExists(email);

    if (!user) {
      return response.status(400).json({
        message:
          "Invalid login attempt. The provided email does not exist. Please register before attempting to log in!",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return response.status(400).json({
        message:
          "Invalid password. Please provide the correct password and try again.",
      });
    }

    const token = userAuth.generateAccessToken(user);

    return response
      .status(200)
      .json({ accessToken: token, isAdmin: user.isAdmin, id: user._id });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "An error occurred during login. Please try again later.",
    });
  }
};

module.exports.getUserInfo = async (request, response) => {
  try {
    const id = request.params.userId;

    let result = await User.findById(id);

    if (!result) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    result.password = "";
    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message:
        "An error occurred during the retrieval. Please try again later.",
    });
  }
};
