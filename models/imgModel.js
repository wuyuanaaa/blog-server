var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  "delete":String,
  "filename":String,
  "hash":String,
  "height":Number,
  "ip":String,
  "path":String,
  "size":Number,
  "storename":String,
  "timestamp":Number,
  "url":String,
  "width":Number
});


module.exports = mongoose.model('Img',schema)