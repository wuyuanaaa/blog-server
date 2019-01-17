var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "permissions":Number
});


module.exports = mongoose.model('User',schema)
