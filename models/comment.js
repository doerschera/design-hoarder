var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
