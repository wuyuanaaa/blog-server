var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  article_title: String,
  article_id: String,
  user: String,
  avatar_url: String,
  date: {
    type: Date,
    default: Date.now
  },
  comment_content: String,
  comment_follow: [
    {
      follow_id: String,
      user: String,
      follow_user: String,
      avatar_url: String,
      comment_content: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Comment', schema);
