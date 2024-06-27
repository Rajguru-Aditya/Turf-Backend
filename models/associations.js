const User = require("./userModel");
const Review = require("./reviewModel");
const Booking = require("./bookingModel");

// Define associations
User.hasMany(Review, { foreignKey: "userId" });
User.hasMany(Booking, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

// Export the models for use elsewhere
module.exports = {
  User,
  Review,
  Booking,
};
