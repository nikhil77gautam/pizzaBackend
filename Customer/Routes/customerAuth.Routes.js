import express from "express";
import { customerSignup, verifyEmail, customerLogin,getUserInfo,getAllUsers } from "../../Customer/Controller/customerAuth.js";

const custemerRouter = express.Router();

custemerRouter.post("/customersignup", customerSignup);
custemerRouter.get("/customerverify-email", verifyEmail);
custemerRouter.post("/customerlogin", customerLogin);
custemerRouter.get("/getUserInfo/:id", getUserInfo);
custemerRouter.get("/getAllUsers", getAllUsers);

export default custemerRouter;
