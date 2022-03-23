const mongoose = require("mongoose");

const TestSchema = mongoose.Schema(
  {
    locationAround: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Polygon"],
        required: true,
      },

      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", TestSchema);

// const Question = mongoose.model(
//   "Question",
//   QuestionSchema.Index({
//     location: "2dsphere",
//   })
// );

// QuestionSchema.createIndex({
//   location: "2dsphere",
// });

module.exports = Test;
