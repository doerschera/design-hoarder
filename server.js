// ---------Dependencies ------------------
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// mongo dependencies
var mongoose = require('mongoose');
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
// Heroku Connection mongodb://heroku_0mh2s0xv:95eg8j4nhn0c9mabf329lhh97p@ds133158.mlab.com:33158/heroku_0mh2s0xv
var db = mongoose.connection;

db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
})

db.once('open', function() {
  console.log('Mongoose connection successful');
})

// --------- Routes ---------------------
app.get('/', function(req, res) {

  // ------- scarping ------------
  // Design milk
  request('http://design-milk.com/', function(error, response, html) {
    var $ = cheerio.load(html);

    $('.latest-listings-grid .article-list-item').each(function(i, element) {
      var result = {};

      result.title = $(this).children('.article-content').find('h3').text();
      result.link = $(this).children('.article-image').attr('href');
      result.img = $(this).children('.article-image').find('img').attr('src');


      console.log(result);
    })

  })


})




// ------- localhost server -------------
app.listen(3000, function() {
  console.log('Running on port 3000');
})
