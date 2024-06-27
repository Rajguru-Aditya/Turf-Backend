const express = require("express");
const {
  getBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  getTurfBookings,
  getBookedTimeSlots,
  getUserBookings,
} = require("../controllers/bookingController");
const router = express.Router();

router.route("/").get(getBookings).post(createBooking);
router.route("/user/:id").get(getUserBookings);
router.route("/:id").get(getBooking).put(updateBooking).delete(deleteBooking);
router.route("/turf/:id").get(getTurfBookings);
router.route("/turf/:id/timeSlots").get(getBookedTimeSlots);

module.exports = router;
