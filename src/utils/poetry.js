var Promise = require('promise');
var Word = require('./../models/wordModel');
var utils = require('./../utils/generalUtils');
var nlp = require('./../utils/nlp');
var _ = require('underscore');

var poetry = {};
//var rhymeLength = 1;

poetry.writePoem = function(bookNumber) {
  return new Promise(function(resolve) {
    Word.find({books: bookNumber}, function(error, data) {
      var rhyme = {};
      var stress = {};

      _.forEach(data, function(wordRecord) {
        utils.addToArrayMap(rhyme, nlp.rhymePart(wordRecord.syllables, 1), wordRecord.word);
        utils.addToArrayMap(stress, wordRecord.stresses, wordRecord.word);
      });

      console.log(rhyme);
      console.log(stress);

      resolve('Writing poem for book number ' + bookNumber);
    });
  });
};

module.exports = poetry;
