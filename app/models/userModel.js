const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    about: { type: String },
    profileImage: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
