var express = require('express');
var router = express.Router();
// mongo dependencies
var mongoose = require('mongoose');
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
// scraping dependencies
var request = require('request');
var cheerio = require('cheerio');
// password hash for user sign-in
var passwordHash = require('password-hash');

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
router.get('/', function(req, res) {

  // ------- scraping ------------
  // Design milk
  request('http://design-milk.com/', function(error, response, html) {
    var $ = cheerio.load(html);

    $('.latest-listings-grid .article-list-item').each(function(i, element) {
      var result = {};

      result.title = $(this).children('.article-content').find('h3').text();
      result.link = $(this).children('.article-image').attr('href');
      result.img = $(this).children('.article-image').find('img').attr('src');
      result.source = 'Design Milk'

      // save to db
      var entry = new Article(result);
      entry.save(function(err, doc) {
        if(err) {
          console.log(err);
        }
      })
    })

    // designboom
    request('http://www.designboom.com/', function(error, response, html) {
      var $ = cheerio.load(html);

      $('.News').each(function(i, element) {
        var result = {};

        result.title = $(this).children('h1').text();
        result.link = $(this).children('.Image').find('a').attr('href');
        result.img = $(this).children('.Image').find('img').attr('src');
        result.source = 'Design Boom';

        var entry = new Article(result);
        entry.save(function(err, doc) {
          if(err) {
            console.log(err);
          }
        })
      })

      // collossal
      request('http://www.thisiscolossal.com/', function(error, response, html) {
        var $ = cheerio.load(html);

        $('article').each(function(i, element) {
          var result = {};

          result.title = $(this).find('h1').find('a').text();
          result.link = $(this).find('h1').find('a').attr('href');
          result.img = $(this).children('.entry-content').first().find('img').attr('src');
          result.source = "Collossal";

          var entry = new Article(result);
          entry.save(function(err, doc) {
            if(err) {
              console.log(err);
            }
          })
        })

        // socks
        request('http://socks-studio.com/', function(error, response, html) {
          var $ = cheerio.load(html);

          $('.featured-content').each(function(i, element) {
            var result = {};

            result.title = $(this).find('.entry-title').children('a').attr('title');
            result.link = $(this).find('.entry-title').children('a').attr('href');
            result.img = $(this).find('article').find('img').attr('src');
            result.source = 'Socks';

            var entry = new Article(result);
            entry.save(function(err, doc) {
              if(err) {
                console.log(err);
              }
            })
          })
        })
      })
    })
  })
  res.redirect('/home');
  console.log(true);
})

// user variable
var currentUser = '';

router.get('/home', function(req, res) {
  Article.find({}, function(err, result) {
    var data = {articles: result};
    res.render('index', data);
  })
})

module.exports = router;
