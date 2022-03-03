const mongoose = require("mongoose");


const QuestionSchema = mongoose.Schema(
    {
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
    },
    {
      timestamps: true,
    }
  );

  const Question = mongoose.model("Question", QuestionSchema);
  



// const Question = mongoose.model("Question", {

//     questionText: {
//         required: true,
//         type: String,
//     },

//     description: {
//         required: true,
//         type: String,
//     },

//     latitude: {
//         required: true,
//         type: Number,
//     },

//     longitude: {
//         required: true,
//         type: Number,
//     },

//     linkWiki: {
//         required: true,
//         type: String,
//     },

//     linkPlace: {
//         required: true,
//         type: String,
//     },

//     questionPicture: Object,

//     questionAudio: Object,

//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Author",
//     },

// },

// {timestamps: true}

// );

module.exports = Question;