const asyncHandler = require("express-async-handler");
const Turf = require("../models/turfModel");
const _ = require("lodash");
const { Op, literal } = require("sequelize");

// @desc    Fetch all turfs
// @route   GET /api/turfs
// @access  Public
const getTurfs = asyncHandler(async (req, res) => {
  // Fetch all turfs from the database
  console.log("Fetching turfs...");
  const turfs = await Turf.findAll();

  // Respond with the turfs
  res.json(turfs);
});

// Filter turfs by selected filter options (city/state/sport)
// @desc    Fetch all turfs by city/state/sport
// @route   GET /api/turfs/filter?city=city&state=state&sport=sport
// @access  Public
const getTurfsByCityStateSport = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching turfs by city, state, and sport...");

    const { city, state, sport } = req.query;

    // Extract and transform query parameters
    const filterOptions = {};
    if (city) filterOptions.city = city.toLowerCase();
    if (state) filterOptions.state = state.toLowerCase();

    // Create a base query object
    const query = {
      where: filterOptions,
    };

    // Add the sport filter using JSON_CONTAINS
    if (sport) {
      query.where = {
        ...query.where,
        availableSports: literal(
          `JSON_CONTAINS(availableSports, '"${sport}"', '$')`
        ),
      };
    }

    console.log("Query: ", query);

    const turfs = await Turf.findAll(query);

    console.log("Filtered turfs: ", turfs);

    res.json(turfs);
  } catch (error) {
    console.error("Error fetching turfs: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Fetch single turf
// @route   GET /api/turfs/:id
// @access  Public
const getTurf = asyncHandler(async (req, res) => {
  // get the turf id from the request parameters
  const turfId = req.params.id;

  // Fetch the turf from the database
  const turf = await Turf.findByPk(turfId);

  // Respond with the turf
  res.json(turf);
});

// @desc    Create an turf
// @route   POST /api/turfs
// @access  Private/Admin
const createTurf = asyncHandler(async (req, res) => {
  try {
    // Extract turf details from request body or wherever they come from
    const turfData = {
      ownerId: req.body.ownerId,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      sports: req.body.sports,
      availableSports: req.body.availableSports,
      capacity: req.body.capacity,
      facilities: req.body.facilities,
      equipments: req.body.equipments,
      days: req.body.days,
      timings: req.body.timings,
      rules: req.body.rules,
      images: req.body.images,
      paymentInfo: req.body.paymentInfo,
      status: req.body.status,
      rating: req.body.rating,
    };

    console.log("Turf data:", turfData);

    // Create the turf in the database
    const createdTurf = await Turf.create(turfData);

    // Respond with the created turf
    res.status(201).json(createdTurf);
  } catch (error) {
    console.error("Error creating turf:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Update an turf
// @route   PUT /api/turfs/:id
// @access  Private/Admin
const updateTurf = asyncHandler(async (req, res) => {
  // get the turf id from the request parameters
  const turfId = req.params.id;

  // Fetch the turf from the database
  const turfData = await Turf.findByPk(turfId);

  // Update the turf in the database
  const updatedTurf = await Turf.update(
    {
      ownerId: req.body.ownerId || turfData.ownerId,
      name: req.body.name || turfData.name,
      address: req.body.address || turfData.address,
      city: req.body.city || turfData.city,
      state: req.body.state || turfData.state,
      sports: req.body.sports || turfData.sports,
      availableSports: req.body.availableSports || turfData.availableSports,
      capacity: req.body.capacity || turfData.capacity,
      facilities: req.body.facilities || turfData.facilities,
      equipments: req.body.equipments || turfData.equipments,
      days: req.body.days || turfData.days,
      timings: req.body.timings || turfData.timings,
      rules: req.body.rules || turfData.rules,
      images: req.body.images || turfData.images,
      paymentInfo: req.body.paymentInfo || turfData.paymentInfo,
      status: req.body.status || turfData.status,
      rating: req.body.rating || turfData.rating,
    },
    {
      where: {
        id: turfId,
      },
    }
  );

  // Respond with the updated turf
  res.status(200).json({
    updated: updatedTurf,
    message: "Turf updated successfully",
    data: turfData,
  });
});

// @desc    Delete an turf
// @route   DELETE /api/turfs/:id
// @access  Private/Admin
const deleteTurf = asyncHandler(async (req, res) => {
  // get id from the request parameters
  const turfId = req.params.id;

  // Delete the turf from the database
  const deletedTurf = await Turf.destroy({
    where: {
      id: turfId,
    },
  });

  // Respond with the deleted turf
  res.status(200).json({
    deleted: deletedTurf,
    message: `Turf ${turfId} deleted successfully`,
  });
});

module.exports = {
  getTurfs,
  getTurfsByCityStateSport,
  getTurf,
  createTurf,
  updateTurf,
  deleteTurf,
};
