var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  link: {
    type: String
  },
  img: {
    type: String
  },
  source: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
