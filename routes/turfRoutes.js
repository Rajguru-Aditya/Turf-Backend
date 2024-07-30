const express = require("express");
const router = express.Router();
const {
  getTurfs,
  getTurf,
  createTurf,
  updateTurf,
  deleteTurf,
  getTurfsByCityStateSport,
  getTurfsByPincode,
  blockTurfSlots,
  getBlockedSlots,
} = require("../controllers/turfController");

// TODO: Add validateTokenHandler middleware

// const validateTokenHandler = require("../middleware/validateTokenHandler");

// router.use(validateTokenHandler);

router.route("/").get(getTurfs).post(createTurf);
router.route("/filter").get(getTurfsByCityStateSport);
router.route("/:id").get(getTurf).put(updateTurf).delete(deleteTurf);
router.route("/pincode/:pincode").get(getTurfsByPincode);
router.route("/:id/block").get(getBlockedSlots).post(blockTurfSlots);

module.exports = router;
