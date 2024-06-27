const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User } = require("../models/associations");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// @desc create a user
// @route POST /api/user/create
// @access Private/Admin
const createUser = asyncHandler(async (req, res) => {
  try {
    console.log("User route hit in userController", req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
    };

    // Create a user
    const user = await User.create(userData);

    // Respond with the created user
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Email or phone number already exists" });
    } else {
      res.status(400);
      throw new Error("Error creating user");
    }
  }
});

// @desc Fetch user by id
// @route GET /api/user/:id
// @access Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // validate token
  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  // check if the user is the of the user
  if (decoded.id !== userId) {
    res.status(401);
    res.json({ message: "Unauthorized" });
  } else {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404);
      res.json({ message: "User not found" });
    } else {
      console.log("User ----------> ", user);
      res.json(user);
    }
  }
});

// @desc Fetch user by email
// @route GET /api/user/email/:email
// @access Private/Admin
const getUserByEmail = asyncHandler(async (req, res) => {
  const email = req.params.email;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const user = await User.findOne({ where: { email } });

  if (user) {
    if (decoded.id === user.id) {
      res.json(user);
    } else {
      res.status(401);
      res.json({ message: "Unauthorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "User not found" });
  }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const user = await User.findByPk(userId);

  if (user) {
    if (decoded.id === user.id) {
      const updatedUser = await user.update(req.body);
      res.json(updatedUser);
    } else {
      res.status(401);
      res.json({ message: "Unauthorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "User not found" });
  }
});

// @desc Delete user
// @route DELETE /api/user/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const decoded = decodeToken(req.headers.authorization.split(" ")[1]);

  const user = await User.findByPk(userId);

  if (user) {
    if (decoded.id === user.id) {
      await user.destroy();
      res.json({ message: "user removed" });
    } else {
      res.status(401);
      res.json({ message: "Unauthorized" });
    }
  } else {
    res.status(404);
    res.json({ message: "User not found" });
  }
});

// @desc user login
// @route POST /api/user/login
// @access Public
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  } else if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      token: jwt.sign(
        { id: user.id, name: user.name, email: user.email },
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
  createUser,
  userLogin,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};
