const { Schema, model } = require('mongoose');
 
const categorySchema = new Schema(
  {
    category: {
      type: String,
      trim: true,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);
 
const Category = model('Category', categorySchema);

module.exports = Category;