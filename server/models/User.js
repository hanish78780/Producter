const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  emailOrPhone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
