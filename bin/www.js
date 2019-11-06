/*var express = require('express');
var router = express.Router();
const app = express(); //
const morgan = require('morgan'); //

module.exports = router;

// settings
app.set('port', process.env.PORT || 4000);

//middlewares
//morgan shows on console the requests to the server
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes 
app.use(require('../src/routes/players'))

// start the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});*/

var express = require('express');
var router = express.Router();
const app = express(); //
const morgan = require('morgan'); //
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb-server/PrograWebDB');

module.exports = router;

// settings
app.set('port', process.env.PORT || 4000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middlewares
//morgan shows on console the requests to the server
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//routes 
app.use(require('../src/routes/players'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// start the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});