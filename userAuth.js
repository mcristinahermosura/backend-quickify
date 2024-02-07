const jwt = require("jsonwebtoken");
const authSecret = "E-CommerceAPI";

module.exports.generateAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(data, authSecret, {});
};

module.exports.verify = (request, response, next) => {
  const token = request.headers.authorization;

  if (!token) {
    return response.status(401).json({
      message: "Authentication token missing. Please provide a valid token for authentication.",
    });
  }

  const tokenValue = token.slice(7);

  jwt.verify(tokenValue, authSecret, (err, decodedToken) => {
    if (err) {
      return response.status(403).json({
        auth: "Failed",
        message: "Action Forbidden",
      });
    }

    request.user = decodedToken;
    next();
  });
};

module.exports.verifyAdmin = (request, response, next) => {
  const token = request.headers.authorization;

  if (!token) {
    return response.status(401).json({
      auth: "Operation Failed. Please check the provided information and try again",
      message: "Access Forbidden: You do not have the necessary permissions to perform this action",
    });
  }

  const tokenValue = token.slice(7);

  jwt.verify(tokenValue, authSecret, (err, decodedToken) => {
    if (err) {
      return response.status(403).json({
        auth: "Failed",
        message: "Action Forbidden",
      });
    }

    if (!decodedToken.isAdmin) {
      return response.status(403).json({
        auth: "Failed",
        message: "Access Forbidden: You do not have the necessary permissions to perform this action",
      });
    }

    next();
  });
};
