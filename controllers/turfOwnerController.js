const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const TurfOwner = require("../models/turfOwnerModel");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// @desc create a turf owner
// @route POST /api/turfOwner
// @access Private/Admin
const createTurfOwner = asyncHandler(async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const turfOwnerData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      turfIds: [req.body.turfIds],
      password: hashedPassword,
      pincode: req.body.pincode,
      city: req.body.city,
      state: req.body.state,
      idProof: req.body.idProof,
      paymentInfo: req.body.paymentInfo,
    };

    // Create a turf owner
    const turfOwner = await TurfOwner.create(turfOwnerData);

    // Respond with the created turf owner
    res.status(201).json(turfOwner);
  } catch (error) {
    res.status(400);
    throw new Error("Error creating turf owner");
  }
});

// @desc Fetch turf owner by id
// @route GET /api/turfOwner/:id
// @access Private/Admin
const getTurfOwner = asyncHandler(async (req, res) => {
  const turfOwnerId = req.params.id;

  // validate token
  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  // check if the user is the owner of the turf
  if (decoded.id !== turfOwnerId) {
    res.status(401);
    res.json({ message: "Not authorized" });
  } else {
    const turfOwner = await TurfOwner.findByPk(turfOwnerId);
    res.json(turfOwner);
  }
});

// @desc Fetch turf owner by email
// @route GET /api/turfOwner/email/:email
// @access Private/Admin
const getTurfOwnerByEmail = asyncHandler(async (req, res) => {
  const email = req.params.email;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const turfOwner = await TurfOwner.findOne({ where: { email } });

  if (turfOwner) {
    if (decoded.id === turfOwner.id) {
      res.json(turfOwner);
    } else {
      res.status(401);
      res.json({ message: "Not authorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "Turf owner not found" });
  }
});

// @desc Update turf owner
// @route PUT /api/turfOwners/:id
// @access Private/Admin
const updateTurfOwner = asyncHandler(async (req, res) => {
  const turfOwnerId = req.params.id;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const turfOwner = await TurfOwner.findByPk(turfOwnerId);

  if (turfOwner) {
    if (decoded.id === turfOwner.id) {
      const updatedTurfOwner = await turfOwner.update(req.body);
      res.json(updatedTurfOwner);
    } else {
      res.status(401);
      res.json({ message: "Not authorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "Turf owner not found" });
  }
});

// @desc add turf to turf owner
// @route PUT /api/turfOwner/:ownerId/addTurf/:turfId
// @access Private/Admin
const addTurfToTurfOwner = asyncHandler(async (req, res) => {
  const turfOwnerId = req.params.ownerId;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const turfOwner = await TurfOwner.findByPk(turfOwnerId);

  if (turfOwner) {
    if (decoded.id !== turfOwner.id) {
      const turfId = req.params.turfId;
      turfOwner.turfIds.push(turfId);
      const updatedTurfOwner = await turfOwner.update({
        turfIds: turfOwner.turfIds,
      });
      res.json(updatedTurfOwner);
    } else {
      res.status(401);
      res.json({ message: "Not authorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "Turf owner not found" });
  }
});

// @desc remove turf from turf owner
// @route PUT /api/turfOwner/:ownerId/removeTurf/:turfId
// @access Private/Admin
const removeTurfFromTurfOwner = asyncHandler(async (req, res) => {
  const turfOwnerId = req.params.ownerId;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const turfOwner = await TurfOwner.findByPk(turfOwnerId);

  if (turfOwner) {
    if (decoded.id !== turfOwner.id) {
      const turfId = req.params.turfId;
      _.remove(turfOwner.turfIds, (id) => id === turfId);
      const updatedTurfOwner = await turfOwner.update({
        turfIds: turfOwner.turfIds,
      });
      res.json(updatedTurfOwner);
    } else {
      res.status(401);
      res.json({ message: "Not authorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "Turf owner not found" });
  }
});

// @desc Delete turf owner
// @route DELETE /api/turfOwner/:id
// @access Private/Admin
const deleteTurfOwner = asyncHandler(async (req, res) => {
  const turfOwnerId = req.params.id;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const turfOwner = await TurfOwner.findByPk(turfOwnerId);

  if (turfOwner) {
    if (decoded.id === turfOwner.id) {
      await turfOwner.destroy();
      res.json({ message: "Turf owner removed" });
    } else {
      res.status(401);
      res.json({ message: "Not authorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "Turf owner not found" });
  }
});

// @desc Turf owner login
// @route POST /api/turfOwner/login
// @access Public
const turfOwnerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const turfOwner = await TurfOwner.findOne({ where: { email } });

  if (!turfOwner) {
    res.status(401);
    throw new Error("Invalid email or password");
  } else if (
    turfOwner &&
    (await bcrypt.compare(password, turfOwner.password))
  ) {
    res.json({
      id: turfOwner.id,
      name: turfOwner.name,
      email: turfOwner.email,
      phone: turfOwner.phone,
      pincode: turfOwner.pincode,
      city: turfOwner.city,
      state: turfOwner.state,
      idProof: turfOwner.idProof,
      paymentInfo: turfOwner.paymentInfo,
      turfIds: turfOwner.turfIds,
      token: jwt.sign(
        { id: turfOwner.id, name: turfOwner.name, email: turfOwner.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

module.exports = {
  createTurfOwner,
  turfOwnerLogin,
  getTurfOwner,
  getTurfOwnerByEmail,
  updateTurfOwner,
  addTurfToTurfOwner,
  removeTurfFromTurfOwner,
  deleteTurfOwner,
};
