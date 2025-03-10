import express from "express";
import{placeorder,updateOrderStatus,getOrder,getAllOrders,deleteOrders}from"../../Admin/Controller/order.js";

const Router = express.Router();

Router.post("/placeOrder",placeorder)
Router.put("/updateOrderStatus/:id",updateOrderStatus)
Router.get("/getOrder/:id",getOrder)
Router.get("/getAllOrders",getAllOrders)
Router.post("/deleteOrders",deleteOrders)

export default Router;