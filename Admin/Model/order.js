import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  cartid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }],

  cartDetails: [{
    type: Object, 
    required: true
  }],

//   name:{
//     type: String, 
//     required: true
//   },
//  phoneNumber:{
//   type: Number, 
//   required: true
//  },

shippingAddress: {
city: { type: String, required: true },
postalCode: { type: String, required: true },
country: { type: String, required: true },
state: { type: String, required: true }
},

deliveryInstructions:{
  type: String, 
  // required: true
},

orderStatus: {
type: String,
enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'],
default: 'Pending'
},

createdAt: {
type: Date,
default: Date.now
}
});
  
const order = mongoose.model("orders",orderSchema);



export default order;
