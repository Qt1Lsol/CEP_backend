const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    email: {
      required: true,
      unique: true,
      type: String,
    },

    birthdate: {
      type: Date,
    },

    token: String,
    hash: String,
    salt: String,
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
