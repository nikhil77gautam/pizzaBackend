import mongoose from "mongoose";

const pizzaSchemas = new mongoose.Schema({
  title:{
    type:String,
    required:true
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
    enum:["veg","nonveg"],
    required:true
  },

image:{
type:String,
required:true
}
},{ timestamps: true });

const pizza = mongoose.model("Pizzadata",pizzaSchemas)
export default pizza;