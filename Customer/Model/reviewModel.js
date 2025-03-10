import mongoose from "mongoose";

const reviewSchemas = mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewData = mongoose.model("CustomerRating", reviewSchemas);

export default ReviewData;
