import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    paymentMode: { type: String, required: true },
    vendor: { type: String },
    billImage: { type: String }
},{ timestamps: true });

const Expense = mongoose.model('adminExpense', expenseSchema);



export default Expense;
