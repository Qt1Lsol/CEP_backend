const mongoose = require("mongoose");

const Question = mongoose.model("Question", {

    timestamps: {createdAt, updatedAt},
    // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },

    questionText: {
        required: true,
        type: String,
    },

    description: {
        required: true,
        type: String,
    },

    latitude: {
        required: true,
        type: Number,
    },

    longitude: {
        required: true,
        type: Number,
    },

    linkWiki: {
        required: true,
        type: String,
    },

    linkPlace: {
        required: true,
        type: String,
    },

    questionPicture: Object,

    questionAudio: Object,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    },

});

module.exports = Question;