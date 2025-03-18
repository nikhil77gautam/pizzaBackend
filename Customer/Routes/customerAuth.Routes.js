import express from "express";
import { customerSignup, verifyEmail, customerLogin,getUserInfo,customerLogout,getAllUsers } from "../../Customer/Controller/customerAuth.js";

const custemerRouter = express.Router();

custemerRouter.post("/customersignup", customerSignup);
custemerRouter.get("/customerverify-email", verifyEmail);
custemerRouter.post("/customerlogin", customerLogin);
custemerRouter.post("/logout", customerLogout);
custemerRouter.get("/getUserInfo/:id", getUserInfo);
custemerRouter.get("/getAllUsers", getAllUsers);

export default custemerRouter;
