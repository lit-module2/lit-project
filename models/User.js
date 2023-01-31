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
      type: Number,
      required: false,
      trim: true
    },
    dateOfBirth: {
      type: String,
      required: false
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    },
    gender: {
      type: String,
      required: false
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    }
  },
  {
    timestamps: true
  }
);
 
const User = model('User', userSchema);

module.exports = User;