const mongoose = require("mongoose");

const GameSchema = mongoose.Schema(
  {
    score: {
      required: true,
      type: Number,
    },

    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    questionAudio: Object,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", QuestionSchema);

module.exports = Game;
