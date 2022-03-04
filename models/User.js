const mongoose = require("mongoose");

const User = mongoose.model("User", {
  
  email: {
    required: true,
    unique: true,
    type: String,
  },

  birthDate: {
    type: Date,
  },

  token: String,
  hash: String,
  salt: String,

});

module.exports = User;
