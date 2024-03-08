const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const userAuth = require("../userAuth.js");
const { RESPONSE_STATUS } = require("../constant/index.js");

const checkEmailExists = async (email) => {
  return await User.findOne({ email });
};

module.exports.registerUser = async (request, response) => {
  try {
    const { email, password, name, isAdmin } = request.body;

    const existingUser = await checkEmailExists(email);

    if (!email || !password || !name) {
      return response.status(400).json({
        message: "Email, password, and name are required.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    if (existingUser) {
      return response.status(400).json({
        message: "Email already exists. Please use a different email.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const newUser = new User({
      email: email,
      password: bcrypt.hashSync(password, 10),
      name,
      isAdmin: isAdmin ?? false,
    });

    const isUserCreated = await newUser.save();

    if (!isUserCreated) {
      return response.status(400).json({
        message: "Failed to register the user. Please try again later.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    return response.status(201).json({
      message: "User registered successfully.",
      status: RESPONSE_STATUS.SUCCESS,
      data: isUserCreated,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "An error occurred during registration. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
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
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return response.status(400).json({
        message:
          "Invalid password. Please provide the correct password and try again.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const token = userAuth.generateAccessToken(user);

    return response.status(200).json({
      accessToken: token,
      isAdmin: user.isAdmin,
      id: user._id,
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "An error occurred during login. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
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
        status: RESPONSE_STATUS.FAILED,
      });
    }

    result.password = "";
    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message:
        "An error occurred during the retrieval. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.updateUser = async (request, response) => {
  try {
    const { id, isAdmin } = request.body;

    const existingUser = await User.findById({ _id: id });

    if (!existingUser) {
      return response.status(404).json({
        message: "User not found",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    const token = request.headers["authorization"].split(" ")[1];
    const decodedToken = await userAuth.decodeToken(token);
    const isAuthorized = decodedToken.id === id;

    if (isAuthorized) {
      return response.status(401).json({
        message: "You are not authorized to update your own account.",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    if (isAdmin === undefined || isAdmin === null) {
      return response.status(400).json({
        message: "isAdmin is required",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    existingUser.isAdmin = isAdmin;

    const saveResult = await existingUser.save();

    if (!saveResult) {
      return response.status(400).json({
        message: "Failed to update user",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    return response.status(200).json({
      message: "User updated successfully",
      data: saveResult,
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message:
        error?.message ||
        "An error occurred during the update. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.getAllUsers = async (request, response) => {
  try {
    const users = await User.find({});

    if (!users) {
      return response.status(404).json({
        message: "No users found",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    return response
      .status(200)
      .json({ data: users, status: RESPONSE_STATUS.SUCCESS });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message:
        "An error occurred during the retrieval. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};

module.exports.deleteUser = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        status: RESPONSE_STATUS.FAILED,
      });
    }

    return response.status(200).json({
      message: "User deleted successfully",
      status: RESPONSE_STATUS.SUCCESS,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "An error occurred during the deletion. Please try again later.",
      status: RESPONSE_STATUS.ERROR,
    });
  }
};
