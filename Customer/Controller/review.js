import ReviewData from "../Model/reviewModel.js";
import Joi from "joi";

// Define the Joi validation schema for creating a review
const createValidation = Joi.object({
  orderId: Joi.string().required().messages({
    "string.base": "Pizza ID must be a string",
    "string.empty": "Pizza ID cannot be empty",
    "any.required": "Pizza ID is required",
  }),
  customerId: Joi.string().required().messages({
    "string.base": "Customer ID must be a string",
    "string.empty": "Customer ID cannot be empty",
    "any.required": "Customer ID is required",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().min(1).required().messages({
    "string.base": "Comment must be a string",
    "string.empty": "Comment cannot be empty",
    "any.required": "Comment is required",
  }),
});

// Create a review
export const createReview = async (req, res) => {
  try {
    const { error } = createValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `Validation error: ${error.details[0].message}` });
    }

    const { orderId, customerId, rating, comment } = req.body;

    const data = await new ReviewData({
      orderId,
      customerId,
      rating,
      comment,
    });

    await data.save();
    res.status(200).json({ success: true, message: "Review added" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding review",
        error: error.message,
      });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const data = await ReviewData.find()
      .populate({ path: "orderId", select: "_id" })
      .populate({ path: "customerId", select: "name email" });

    res.status(200).json({ success: true, reviews: data });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Error fetching data",
        error: error.message,
      });
  }
};

// // Get one review by ID
// export const getOneReview = async (req, res) => {
//   const validation = Joi.object({
//     id: Joi.string().required().messages({
//       'string.base': 'Review ID must be a string',
//       'string.empty': 'Review ID cannot be empty',
//       'any.required': 'Review ID is required',
//     }),
//   });

//   try {
//     const { error } = validation.validate(req.params);
//     if (error) {
//       return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
//     }

//     const review = await ReviewData.findById(req.params.id);
//     if (!review) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     return res.status(200).json({ success: true, review });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Update a review
// export const updateReview = async (req, res) => {
//   const validation = Joi.object({
//     rating: Joi.number().integer().min(1).max(5).required(),
//     comment: Joi.string().min(1).required(),
//   });

//   try {
//     const { error } = validation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
//     }

//     const updatedReview = await ReviewData.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedReview) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     return res.status(200).json({ success: true, message: "Review updated", review: updatedReview });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
//   }
// };

// // Delete a review
// export const deleteReview = async (req, res) => {
//   const validation = Joi.object({
//     id: Joi.string().required().messages({
//       'string.base': 'Review ID must be a string',
//       'string.empty': 'Review ID cannot be empty',
//       'any.required': 'Review ID is required',
//     }),
//   });

//   try {
//     const { error } = validation.validate(req.params);
//     if (error) {
//       return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
//     }

//     const result = await ReviewData.findByIdAndDelete(req.params.id);
//     if (!result) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     res.status(200).json({ success: true, message: "Review deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting review", error: error.message });
//   }
// };

// // Get reviews by user
// export const getReviewsByUser = async (req, res) => {
//   try {
//     const reviews = await ReviewData.find({ customerId: req.params.userId });
//     res.status(200).json({ success: true, reviews });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
//   }
// };

// // Get reviews by product
// export const getReviewsByProduct = async (req, res) => {
//   try {
//     const reviews = await ReviewData.find({ pizzaId: req.params.productId });
//     res.status(200).json({ success: true, reviews });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
//   }
// };
