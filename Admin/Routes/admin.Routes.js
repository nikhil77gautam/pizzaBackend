import express from "express";
import { adminSignup,
    adminverifyEmail,
    adminlogin,}from "../../Admin/Controller/adminAuth.js"





    const adminRouter = express.Router();

    adminRouter.post("/adminsignup",adminSignup)
    adminRouter.get("/adminverifyEmail",adminverifyEmail)
    adminRouter.post("/adminlogin",adminlogin)

    export default adminRouter ;