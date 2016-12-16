var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: [
      function(password) {
        return password.length >= 8;
      },
      "Your password must contain at least 8 characters!"
    ]
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  article: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
})

var User = mongoose.model('User', UserSchema);

module.exports = User;
