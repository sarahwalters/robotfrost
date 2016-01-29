/* REQUIRES */
// ...npm
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ...local
var index = require('./routes/index.js');

/* CONNECT TO MONGOOSE */
mongoose.connect(process.env.MONGOURI || 'mongodb://localhost/test');

/* CONFIG APP */
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views/'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts/')
}));
app.set('view engine', 'handlebars');

/* ROUTING */
app.get('/', index.sampleGet);
app.post('/', index.samplePost);

app.listen(process.env.PORT || 3000);
