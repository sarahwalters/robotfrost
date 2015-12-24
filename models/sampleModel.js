var mongoose = require('mongoose');

var sampleSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Sample', sampleSchema);
