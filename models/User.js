const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    required: true,
    unique: true,
    type: String,
  },
  birthDate: {
    // required: true,
    type: Date,
  },
  username: {
    // required: true,
    type: Date,
  },

  avatar: Object,

  token: String,
  hash: String,
  salt: String,

});

module.exports = User;
