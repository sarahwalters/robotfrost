//var mongoose = require('mongoose');
//var Sample = require('./../models/sampleModel.js');

var routes = {};

routes.sampleGet = function(req, res) {
  res.render('message', {'message': 'Rendered from index.js'});
};

routes.samplePost = function(req, res) {
  res.json({'message': 'Welcome!'});
};

module.exports = routes;
