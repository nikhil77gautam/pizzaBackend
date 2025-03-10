import express from "express";
import mongoose from "mongoose";
import customerRouter from "./Customer/Routes/customerAuth.Routes.js";
import cartRouter from "./Customer/Routes/cartData.Routes.js";
import pizzaRouter from "./Admin/Routes/pizzaData.Routes.js";
import orderRouter from "./Admin/Routes/order.Routes.js";
import adminRouter from "./Admin/Routes/admin.Routes.js";
import expenseRouter from "./Admin/Routes/expense.Routes.js";
import MealsRouter from "./Admin/Routes/meals.Routes.js";
import reviewRouter from "./Customer/Routes/review.Routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uplods", express.static("uplods"));

// DB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/pizzaFullStack")
  .then(() => {
    console.log("Database connection is successful");
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

// Use routers
app.use(customerRouter);
app.use(cartRouter);
app.use(pizzaRouter);
app.use(orderRouter);
app.use(adminRouter);
app.use(expenseRouter);
app.use(MealsRouter);
app.use(reviewRouter);

// Start server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
