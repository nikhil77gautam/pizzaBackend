import express from "express";
import protect from "../../Middelwares/middelwares.js"

import { getcart,
    addtocart,
    removefromcart,
    updateCartQuantity
} from "../../Customer/Controller/cartData.js";


    const cartRouter = express.Router();

    cartRouter.get("/getcartpizza/:id",protect,getcart);
    cartRouter.post("/addtocart", protect, addtocart);

    cartRouter.post("/deletecartpizza", protect, removefromcart);
    cartRouter.put('/updatecartQuantity/:customerId/:id',protect, updateCartQuantity);

    export default  cartRouter;