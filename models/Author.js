const mongoose = require("mongoose");

const Author = mongoose.model("Author", {
  entity: {

    name: {
      required: true,
      type: String,
    },
    site: {
      required: true,
      type: String,
    },

    logo: Object,

    type: {
      required: true,
      type: String,
    },
  },

  email: {
    unique: true,
    required: true,
    type: String,
  },

  creationDate: {
    required: true,
    type: Date,
    default: Date.now,
  },



  token: String,

  hash: String,

  salt: String,

});

module.exports = Author;
