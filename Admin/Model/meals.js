import mongoose from "mongoose";

const  mealsSchemas = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["Beverages","Desserts"],
        required:true
    },

    image:{
        type:String,
        required:true
    }
},{ timestamps: true });

const meals = mongoose.model("mealsItems",mealsSchemas);

export default meals;