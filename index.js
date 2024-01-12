const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cors = require("cors");
const port = 4004;
const app = express();

mongoose.connect(
  "mongodb+srv://admin:admin@batch330hermosura.8crupdx.mongodb.net/E-CommerceAPI?retryWrites=true&w=majority"
);

let connect = mongoose.connection;
connect.on("error", console.error.bind(console, "Connection error!"));
connect.once("open", () => {
  console.log("You are now connected with the database!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("b4/users", userRoutes);
app.use("b4/products", productRoutes);


app.listen(port, () => {
  console.log(`E-commerce API is online on port ${port}`);
});
