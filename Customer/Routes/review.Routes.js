import express from "express";
import { 
  createReview, 
  getAllReviews, 
  // getOneReview,
  // updateReview,
  // deleteReview,
  // getReviewsByUser,
  // getReviewsByProduct
} from "../Controller/review.js";

const Router = express.Router();

// Create a review
Router.post("/createReview", createReview);

// Get all reviews
Router.get("/getAllReviews", getAllReviews);

// // Get one review by ID
// Router.get("/oneUserReviewFetch/:id", getOneReview);

// // Update a review by ID
// Router.put("/updateReview/:id", updateReview);

// // Delete a review by ID
// Router.delete("/deleteReviewOne/:id", deleteReview);

// // Get reviews by user
// Router.get("/users/:userId", getReviewsByUser);

// // Get reviews by product
// Router.get("/products/:productId", getReviewsByProduct);

export default Router;
