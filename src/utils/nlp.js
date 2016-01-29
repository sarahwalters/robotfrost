var cmu = require('cmudict');
var parser = new cmu.CMUDict();
var _ = require('underscore');

var nlp = {};

var hasVowel = new RegExp(/[A-Z]*(0|1|2)/);
var stripLeadingConsonants = new RegExp(/[AEIOU][A-Z0-9]*/);

function findVowels(phonemes) {
  var vowelIndices = [];

  _.map(phonemes, function(phoneme, index) {
    if (hasVowel.test(phoneme)) {
      vowelIndices.push(index);
    }
  });

  return vowelIndices;
}

nlp.getSyllables = function(word) {
  var phonemeStr = parser.get(word);
  if (!phonemeStr) {
    return null;
  }

  var phonemes = phonemeStr.split(' ');
  var vowelIndices = findVowels(phonemes);
  var numSyllables = vowelIndices.length;

  var syllables = [];
  var currentSyllable = '';

  var i = 0;
  while (i < phonemes.length) {
    var phoneme = phonemes[i];
    var isVowel = _.indexOf(vowelIndices, i) > -1;

    // Always add the current phoneme
    currentSyllable += phoneme;
    i++;

    // If a vowel: handle special cases
    if (isVowel) {
      var lastSyllable = (syllables.length === numSyllables - 1);
      var followedByTwoConsonants = (2 < vowelIndices[syllables.length + 1] - vowelIndices[syllables.length]);

      if (lastSyllable) {
        // Add the rest of the phonemes
        while (i < phonemes.length) {
          currentSyllable += phonemes[i];
          i++;
        }
      } else if (followedByTwoConsonants) {
        currentSyllable += phonemes[i];
        i++;
      }

      // Push the syllable
      syllables.push(currentSyllable);
      currentSyllable = '';
    }
  }

  return syllables;
};

nlp.getStresses = function(syllables) {
  if (!syllables || syllables.length === 0) {
    return null;
  }

  return _.chain(syllables)
          .map(function(syllable) {
            return _.indexOf(syllable, '0') > -1 ? '0' : '1';
          })
          .join('')
          .value();
};

nlp.rhymePart = function(syllables, n) {
  if (!syllables) {
    return null;
  }

  var lastNSyllables = syllables.slice(-n).join('');
  return stripLeadingConsonants.exec(lastNSyllables)[0];
};

module.exports = nlp;
