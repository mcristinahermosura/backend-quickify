const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/index.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cors = require("cors");
const path = require("path");
const PORT = config.port;
const MONGO_URI = config.mongoUri;
const { logger } = require("./middleware/middleware.js");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("You are now connected with the database!"))
  .catch((error) => console.error("Connection error!", error));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/b4/users", logger, userRoutes);
app.use("/b4/products", logger, productRoutes);
app.use("/b4/orders", logger, orderRoutes);
app.use("/b4/files", logger, express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`E-commerce API is listening on port ${PORT}`);
});
