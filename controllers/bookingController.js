const asyncHandler = require("express-async-handler");
const { Booking, User } = require("../models/associations");
const moment = require("moment");

// @desc    Fetch all bookings
// @route   GET /api/bookings
// @access  Public
const getBookings = asyncHandler(async (req, res) => {
  // Fetch all bookings from the database
  console.log("Fetching bookings...");
  const bookings = await Booking.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name", "phone", "email"],
      },
    ],
  });

  // Respond with the bookings
  res.json(bookings);
});

// @desc Fetch bookings for a user
// @route GET /api/bookings/user/:id
// @access Public
const getUserBookings = asyncHandler(async (req, res) => {
  // get the user id from the request parameters
  const userId = req.params.id;

  // Fetch all bookings for the user from the database
  const bookings = await Booking.findAll({
    where: {
      userId: userId,
    },
    include: {
      model: User,
      attributes: ["id", "name", "phone", "email"],
    },
  });

  // Respond with the bookings
  res.json(bookings);
});

// @desc    Fetch single booking
// @route   GET /api/bookings/:id
// @access  Public
const getBooking = asyncHandler(async (req, res) => {
  // get the booking id from the request parameters
  const bookingId = req.params.id;

  // Fetch the booking from the database
  const booking = await Booking.findByPk(bookingId, {
    include: [
      {
        model: User,
        attributes: ["id", "name", "phone", "email"],
      },
    ],
  });

  // Respond with the booking
  res.json(booking);
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  try {
    const bookingData = {
      date: req.body.date,
      endDate: req.body.endDate,
      userId: req.body.userId,
      sport: req.body.sport,
      turfId: req.body.turfId,
      cost: req.body.cost,
      status: req.body.status,
      timeSlots: req.body.timeSlots,
    };

    // Create a booking
    const booking = await Booking.create(bookingData);

    // Respond with the created booking
    res.status(201).json(booking);
  } catch (error) {
    res.status(400);
    throw new Error("Error creating booking");
  }
});

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  // get the booking id from the request parameters
  const bookingId = req.params.id;

  // Find the booking by id and update it
  const booking = await Booking.findByPk(bookingId);
  if (booking) {
    await booking.update({
      date: req.body.date || booking.date,
      endDate: req.body.endDate || booking.endDate,
      userId: req.body.userId || booking.userId,
      sport: req.body.sport || booking.sport,
      turfId: req.body.turfId || booking.turfId,
      cost: req.body.cost || booking.cost,
      status: req.body.status || booking.status,
      timeSlots: req.body.timeSlots || booking.timeSlots,
    });
    res.json(booking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  // get the booking id from the request parameters
  const bookingId = req.params.id;

  // Find the booking by id and delete it
  const booking = await Booking.findByPk(bookingId);
  if (booking) {
    await booking.destroy();
    res.json({ message: "Booking removed" });
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Get all bookings for a turf
// @route   GET /api/bookings/turf/:id
// @access  Public
const getTurfBookings = asyncHandler(async (req, res) => {
  // get the turf id from the request parameters
  const turfId = req.params.id;

  // Fetch all bookings for the turf from the database
  const bookings = await Booking.findAll({
    where: {
      turfId: turfId,
    },
    include: {
      model: User,
      attributes: ["id", "name", "phone", "email"],
    },
  });

  // Respond with the bookings
  res.json(bookings);
});

// @desc Get booked time slots for a turf
// @route GET /api/bookings/turf/:id/timeSlots
// @access Public
const getBookedTimeSlots = asyncHandler(async (req, res) => {
  // get the turf id from the request parameters
  const turfId = req.params.id;

  // Fetch all bookings for the turf from the database
  const bookings = await Booking.findAll({
    where: {
      turfId: turfId,
    },
  });

  // Get all the booked time slots from the bookings by date
  const bookedTimeSlots = {};
  bookings.forEach((booking) => {
    const date = booking.date;
    const timeSlots = booking.timeSlots;
    if (bookedTimeSlots[date]) {
      const formattedDate = moment(bookedTimeSlots[date]).format("YYYY-MM-DD");
      formattedDate.push(timeSlots);
    } else {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      bookedTimeSlots[formattedDate] = timeSlots;
    }
  });

  // Respond with the booked time slots
  res.json(bookedTimeSlots);
});

module.exports = {
  getBookings,
  getBooking,
  getTurfBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookedTimeSlots,
  getUserBookings,
};
