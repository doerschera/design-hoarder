// ---------Dependencies ------------------
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');


// -------- Initialize Express -------------
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static('public'));


// ------- HBS config --------------------
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

var routes = require('./controllers/controller.js');
app.use('/', routes);


// ------- localhost server -------------
app.listen(process.env.PORT || 3000);
