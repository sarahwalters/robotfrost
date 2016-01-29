//var mongoose = require('mongoose');
//var Sample = require('./../models/sampleModel');
//var nlp = require('./../utils/nlp');
var gutenberg = require('./../utils/gutenberg');
var poetry = require('./../utils/poetry');

var routes = {};

routes.sampleGet = function(req, res) {
  console.log('--------------------');
  var bookNumber = 98;
  gutenberg.loadBook(bookNumber)
    .then(function() {
      return poetry.writePoem(bookNumber);
    })
    .then(function(poem) {
      res.render('message', {'message': poem});
    });
};

routes.samplePost = function(req, res) {
  res.json({'message': 'Welcome!'});
};

module.exports = routes;
