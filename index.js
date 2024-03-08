const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/index.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/middleware.js");
const PORT = config.port;
const MONGO_URI = config.mongoUri;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("You are now connected with the database!"))
  .catch((error) => console.error("Connection error!", error));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/files", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`E-commerce API is listening on port ${PORT}`);
});
