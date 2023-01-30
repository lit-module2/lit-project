const { Schema, model } = require('mongoose');
 
const questionSchema = new Schema(
  {
    // Question text
    question: {
      type: String,
      trim: true,
      required: [true, 'You must submit a question.'],
      unique: true
    },
    // Categories where an answer to the question counts positively
    positiveCategory: {
        type: [Object],
        trim: true,
        required: true,
    },
    // Categories where an answer to the question counts negatively
    negativeCategory: {
        type: [Object],
        trim: true,
        required: true
    },
    // true --> question apt to everyone, false --> sensitive content
    safe: {
        type: Boolean,
        default: true,
        required: true
    },
    // admin approved
    _approved: {
        type: Boolean,
        default: false
    },
    // author of the question, taken from the user session ID
    _author: {
        type: Schema.Types.ObjectId,
    }
  },
  {
    timestamps: true
  }
);
 
const Question = model('Question', questionSchema);

module.exports = Question;