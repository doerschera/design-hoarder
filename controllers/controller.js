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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/designHoarder');

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
})

// user variable
var currentUser = '';

router.get('/home', function(req, res) {
  Article.find({}).sort({date: -1})
    .exec(function(err, result) {
      var data = {articles: result};
      res.render('index', data);
    })
})

router.post('/home', function(req, res) {
  var data = req.body;

  switch(data.type) {

    case 'sign up':
      var hashedPassword = passwordHash.generate(data.password);
      var userDetails = {
        username: data.username,
        password: hashedPassword
      }
      var user = new User(userDetails)

      user.save(function(err) {
        if (err) {
          console.log(err);
          var errMessage;
          for(field in err.errors) {
            errMessage = err.errors[field].message;
          }
          console.log(errMessage);
        }
        if(errMessage != undefined) {
          res.send(errMessage);
        } else {
          currentUser = userDetails.username;
          res.send(true);
        }
      })
      break;

    case 'sign in':
      var username = data.username;
      var password = data.password;
      console.log('sign in');

      User.find({username: username}, function(err, result) {
        if(result.length < 1) {
          res.send('Username or password incorrect!');
        } else {
          var hashedPassword = result[0].password;
          var verify = passwordHash.verify(password, hashedPassword);

          if(verify) {
            currentUser = username;
            res.send(result[0].article);
          } else {
            res.send('Username or password incorrect!');
          }
        }
      })
      break;

    case 'add favorite':
      var articleId = data.id;
      User.findOneAndUpdate({username: currentUser}, {$push: {article: articleId}})
        .exec(function(err, doc) {
          if(err) {
            console.log(err);
          } else {
            console.log(doc);
            res.send(true);
          }
        })
      break;

  }
})

module.exports = router;
