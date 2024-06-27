const express = require("express");
const {
  createUser,
  getUser,
  getUserByEmail,
  updateUser,
  userLogin,
  deleteUser,
} = require("../controllers/userController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const router = express.Router();

// router.use(validateTokenHandler);

router.route("/create").post((req, res) => {
  console.log("Create API is running....");
  createUser(req, res);
});

router.route("/email/:email").get((req, res) => {
  console.log("Get by email API is running....");
  getUserByEmail(req, res);
});

router
  .route("/:id")
  .get((req, res) => {
    console.log("Get API is running....");
    getUser(req, res);
  })
  .put((req, res) => {
    console.log("Update API is running....");
    updateUser(req, res);
  })
  .delete((req, res) => {
    console.log("Delete API is running....");
    deleteUser(req, res);
  });

router.route("/login").post((req, res) => {
  console.log("Login API is running....");
  userLogin(req, res);
});

router.route("/logout").get((req, res) => {
  console.log("Logout API is running....");
  // logoutUser(req, res);
});

module.exports = router;
