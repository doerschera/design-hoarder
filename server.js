// ---------Dependencies ------------------
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// mongo dependencies
var mongoose = require('mongoose');
var mongoose.Promise = require('bluebird');
// scraping dependencies
var request = require('request');
var cheerio = require('cheerio');

// -------- Initialize Express -------------
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static('public'));

// --------- Mongo Config ------------------
mongoose.connect('mongodb://localhost/designHoarder');
var db = mongoose.connection;

db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
})

db.once('open', function() {
  console.log('Mongoose connection successful');
})

// --------- Routes ---------------------





// ------- localhost server -------------
app.listen(3000, function() {
  console.log('Running on port 3000');
})
