import express from "express"
import {createpizza, updatepizzas, readallpizzas, readOnePizza, deletepizzas, deleteallpizzas,categoryFindPIzza }from "../../Admin/Controller/pizzasData.js"

import upload from "../../Middelwares/multer.js"
// import protect from "../../Middelwares/middelwares.js"


const pizzaRouter =  express.Router();

pizzaRouter.post("/createpizza",upload.single('image'),createpizza);
pizzaRouter.put("/updatepizzas/:id",upload.single('image'),updatepizzas);
pizzaRouter.get("/readallpizzas",readallpizzas);
pizzaRouter.get("/readOnePizza/:id",readOnePizza);
pizzaRouter.post("/deletepizzas/:id",deletepizzas);
pizzaRouter.post("/deleteallpizzas",deleteallpizzas);
pizzaRouter.post("/categoryFindPIzza",categoryFindPIzza);

export default pizzaRouter;