const asyncHandler = require("express-async-handler");
const { Review, User } = require("../models/associations");

// @desc    Fetch all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  // Fetch all reviews from the database
  console.log("Fetching reviews...");
  const reviews = await Review.findAll();

  // Respond with the reviews
  res.json(reviews);
});

// @desc   Fetch all reviews by turf id
// @route  GET /api/reviews/turf/:id
// @access Public
const getReviewsByTurfId = asyncHandler(async (req, res) => {
  // Fetch all reviews from the database
  console.log("Fetching reviews by turf id...");

  const { id } = req.params;

  // Filter reviews based on query parameters
  const filteredReviews = await Review.findAll({
    where: { turfId: id },
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
    ],
  });

  // Respond with the filtered reviews
  res.json(filteredReviews);
});

// @desc    Fetch single review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  // get the review id from the request parameters
  const reviewId = req.params.id;

  // Fetch the review from the database
  const review = await Review.findByPk(reviewId);

  // Respond with the review
  res.json(review);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  try {
    const reviewData = {
      rating: req.body.rating,
      userId: req.body.userId,
      review: req.body.review,
      turfId: req.body.turfId,
    };

    // Create a review
    const review = await Review.create(reviewData);

    // Respond with the created review
    res.status(201).json(review);
  } catch (error) {
    res.status(400);
    throw new Error("Error creating review");
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  // get the review id from the request parameters
  const reviewId = req.params.id;

  // Find the review by id and delete it
  const review = await Review.findByPk(reviewId);
  if (review) {
    await review.destroy();
    res.json({ message: "Review removed" });
  } else {
    res.status(404);
    throw new Error("Review not found");
  }
});

module.exports = {
  getReviews,
  getReviewsByTurfId,
  getReview,
  createReview,
  deleteReview,
};
