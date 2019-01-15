var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: String,
  date: Number,
  tags: Array,
  readCount: Number,
  abstract: String,
  content: String,
  mdContent: String
});

module.exports = mongoose.model('Article', schema);
