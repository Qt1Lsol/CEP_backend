const mongoose = require("mongoose");

const Question = mongoose.model("Question", {

    questionText: {
        required: true,
        type: String,
    },

    questionDescription: {
        required: true,
        type: String,
    },

    questionLevel: {
        required: true,
        type: Number,
    },

    questionType: {
        required: true,
        type: String,
    },

    questionLink: {
        required: true,
        type: string,
    },

    questionLocation: {
        locationType: {
            required: true,
            type: String,
        },
        locationCoordinates: {
            required: true,
            type: Number,
        },

        locationLink: {
            required: true,
            type: string,
        },

        locationName: {
            required: true,
            type: String,
        },
        locationCategory: {
            required: true,
            type: String,
        },

        questionImg: Object,

        questionAudio: Object,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    },

});

module.exports = Question;