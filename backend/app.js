const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());
// Route imports...
const product = require('./routes/productRoute');
const user = require('./routes/userRoutes');
const order = require('./routes/orderRoute');

// using...
app.use("/api", product);
app.use("/api", user);
app.use("/api", order);
// Middleware for errors...
app.use(errorMiddleware);


module.exports = app;
