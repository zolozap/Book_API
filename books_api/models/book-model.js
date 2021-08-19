
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new mongoose.Schema({
  title: String,
  description:String,
  image: String,
  price: Number,
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  }
});

module.exports = Book = mongoose.model('book', BookSchema);