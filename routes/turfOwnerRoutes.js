const express = require("express");
const router = express.Router();
const {
  getTurfOwner,
  createTurfOwner,
  updateTurfOwner,
  deleteTurfOwner,
  getTurfOwnerByEmail,
  addTurfToTurfOwner,
  removeTurfFromTurfOwner,
  turfOwnerLogin,
} = require("../controllers/turfOwnerController");
const validateTokenHandler = require("../middleware/validateTokenHandler");

router.route("/create").post((req, res) => {
  console.log("Create API is running....");
  createTurfOwner(req, res);
});

router.route("/email/:email").get((req, res) => {
  console.log("Get by email API is running....");
  getTurfOwnerByEmail(req, res);
});

router
  .route("/:id")
  .get((req, res) => {
    console.log("Get API is running....");
    getTurfOwner(req, res);
  })
  .put((req, res) => {
    console.log("Update API is running....");
    updateTurfOwner(req, res);
  })
  .delete((req, res) => {
    console.log("Delete API is running....");
    deleteTurfOwner(req, res);
  });

router.route("/login").post((req, res) => {
  console.log("Login API is running....");
  turfOwnerLogin(req, res);
});

router.route("/:ownerId/addTurf/:turfId").put((req, res) => {
  console.log("Add turf API is running....");
  addTurfToTurfOwner(req, res);
});

router.route("/:ownerId/removeTurf/:turfId").put((req, res) => {
  console.log("Remove turf API is running....");
  removeTurfFromTurfOwner(req, res);
});

module.exports = router;
