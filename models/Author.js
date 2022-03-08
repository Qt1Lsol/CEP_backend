const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema(
  {
    // entity: {

    //   name: {
    //     // required: true,
    //     type: String,
    //   },
    //   site: {
    //     // required: true,
    //     type: String,
    //   },

    //   logo: Object,

    //   type: {
    //     // required: true,
    //     type: String,
    //   },
    // },

    email: {
      unique: true,
      required: true,
      type: String,
    },

    token: String,

    hash: String,

    salt: String,
  },

  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
