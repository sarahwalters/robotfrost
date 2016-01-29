var request = require('request');
var nlp = require('./../utils/nlp');
var utils = require('./../utils/generalUtils');
var Word = require('./../models/wordModel');
var _ = require('underscore');
var Promise = require('promise');

var gutenberg = {};

gutenberg.loadBook = function(bookNumber) {
  return new Promise(function(resolve) {
    Word.findOne({books: bookNumber}, function(error, data) {
      if (_.isEmpty(data)) {
        var url = 'http://www.gutenberg.org/cache/epub/' + bookNumber + '/pg' + bookNumber + '.txt';
        request.get(url, function(error, response, body) {
          processBook(body, bookNumber)
            .then(function() {
              resolve();
            });
        });
      } else {
        resolve();
      }
    });
  });
};

function processBook(body, bookNumber) {
  // Strip boilerplate text
  var roughStartIndex = body.indexOf('*** START OF');
  var roughEndIndex = body.indexOf('*** END OF');
  var roughClean = body.slice(roughStartIndex, roughEndIndex);

  var fineStartIndex = roughClean.indexOf('\n');
  var fineEndIndex = roughClean.lastIndexOf('\n');
  var fineClean = roughClean.slice(fineStartIndex, fineEndIndex);

  var rawWords = fineClean.split(/(?!')\W/)  // at non-alpha characters (leave only words)
                          .filter(function(str) {
                            return /\S/.test(str);
                          });

  rawWords = _.map(rawWords, function(word) {
    return word.toLowerCase();
  });

  var shortRawWords = rawWords.splice(41,60);
  console.log(shortRawWords);

  // Extract syllables/rhyme and save to db
  return new Promise(function(resolve) {
    processWords(shortRawWords, bookNumber, resolve);
  });
}

function processWords(rawWords, bookNumber, resolve) {
  // Base case
  if (rawWords.length === 0) {
    resolve();
  } else {
    var word = rawWords.pop();
    var prevWords = [null, null];
    if (rawWords.length > 1) {
      prevWords = rawWords.slice(-2);
    } else if (rawWords.length === 1) {
      prevWords[1] = rawWords[0];
    }

    Word.findOne({word: word}, function(error, record) {
      if (_.isEmpty(record)) {
        var syllables = nlp.getSyllables(word);

        if (syllables) {
          var stresses = nlp.getStresses(syllables);

          var wordData = {
            word: word,
            syllables: syllables,
            stresses: stresses,
            books: [bookNumber],
            onePrev: prevWords[1] ? [prevWords[1]] : [],
            twoPrev: prevWords[0] ? [prevWords[0]] : []
          };

          new Word(wordData).save(function() {
            processWords(rawWords, bookNumber, resolve);
          });
        }
      } else {
        utils.addIfUnique(record.books, bookNumber);
        utils.addIfUnique(record.onePrev, prevWords[1]);
        utils.addIfUnique(record.twoPrev, prevWords[0]);

        record.markModified('books');
        record.markModified('onePrev');
        record.markModified('twoPrev');

        record.save(function() {
          processWords(rawWords, bookNumber, resolve);
        });
      }
    });
  }
}

module.exports = gutenberg;
