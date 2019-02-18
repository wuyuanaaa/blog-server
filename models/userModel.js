var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "type":String
});


module.exports = mongoose.model('User',schema)
