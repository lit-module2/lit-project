const { Schema, model, SchemaTypes } = require('mongoose');
 
const userAnswerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    userAsked: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userAnswered: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    usersIgnored: {
        type: [Schema.Types.ObjectId],
        required: true,
    }
  },
  {
    timestamps: true
  }
);
 
const UserAnswer = model('UserAnswer', userAnswerSchema);

module.exports = UserAnswer;