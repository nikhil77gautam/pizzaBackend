import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    pizzas: [
        {
            pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizzadata", required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    meals: [
        {
            meal: { type: mongoose.Schema.Types.ObjectId, ref: "mealsItems", required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
   
   
},
{ timestamps: true });

const cartdata = mongoose.model("Cart", cartSchema);

export default cartdata;
