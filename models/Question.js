const { Schema, model } = require('mongoose');

const questionSchema = new Schema(
  {
    emoji: {
      type: String,
      trim: true,
      default: "😳"
    },
    question: {
      type: String,
      trim: true,
      required: [true, 'You must submit a question.'],
      unique: true
    },
    category: {
        type: String,
        enum: ['Baldness', 'Attractiveness', 'Style', 'Programming skills'],
        required: true,
    },
    // choose whether the question has a positive affect on its category or a negative one
    effect: {
      type: Boolean,
      default: true,
      required: true
    },
    // true --> question apt to everyone, false --> sensitive content
    safe: {
        type: Boolean,
        default: true,
        required: true
    },
    _approved: {
        type: Boolean,
        default: false
    },
    _author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true
  }
);
 
const Question = model('Question', questionSchema);

module.exports = Question;