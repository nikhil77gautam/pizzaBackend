import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // dateOfBirth: {
    //   type: Date,
    //   required: true
    // },
    // gender: {
    //   type: String,
    //   enum: ['Male', 'Female', 'Non-Binary', 'Other'],
    //   required: true
    // },
    address: [
      {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
    ],
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
  },
  { timestamps: true } 
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
