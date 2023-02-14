const { Schema, model } = require('mongoose');
 
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      default: 'Undisclosed'
    },
    age: {
      type: Number,
      required: false,
      default: 13
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    },
    gender: {
      type: String,
      required: false,
      default: 'Undisclosed'
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },
    deletedAccount: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true
  }
);
 
const User = model('User', userSchema);

module.exports = User;