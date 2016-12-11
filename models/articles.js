var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  img: {
    type: String
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comments'
  }
})

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
