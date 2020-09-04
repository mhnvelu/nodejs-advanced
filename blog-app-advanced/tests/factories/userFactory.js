const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = () => {
  // empty object is used here because we dont use googleId, displayname anywhere in the application.
  // we need only user._id
  return new User({}).save();
};
