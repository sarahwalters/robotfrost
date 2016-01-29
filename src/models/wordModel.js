var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
  word: String,
  syllables: [String],
  stresses: String,
  books: [Number],
  onePrev: [String],
  twoPrev: [String]
});

module.exports = mongoose.model('Word', wordSchema);
