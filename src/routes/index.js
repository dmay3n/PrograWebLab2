var express = require('express');
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
});