const mongoose = require("mongoose");

const Question = mongoose.model("Question", {

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


    // questionImg: Object,
    questionPicture: { type: mongoose.Schema.Types.Mixed, default: {} },

    //     questionAudio: Object,
    // },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    },

});

module.exports = Question;