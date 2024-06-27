const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  getReviewsByTurfId,
} = require("../controllers/reviewController");

const router = express.Router();

router.route("/").get(getReviews).post(createReview);
router.route("/:id").get(getReview).delete(deleteReview);
router.route("/turf/:id").get(getReviewsByTurfId);

module.exports = router;
