var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: String,
  date: Number,
  lastDate: Number,
  tags: Array,
  readCount: Number,
  abstract: String,
  content: String,
  mdContent: String,
  type: Number,
  catalog: [
    {
      lev: Number,
      text: String,
      id: String
    }
  ]
});

module.exports = mongoose.model('Article', schema);
