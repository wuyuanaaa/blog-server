var express = require('express');
var router = express.Router();
var Article = require('../models/articleModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://blogAdmin:920602@127.0.0.1:27017/blog');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 添加文章
router.post('/save', function (req, res) {
  new Article(req.body.data).save(function (err) {
    if (err) {
      res.status(500).send();
      return
    }
    res.send();
  })
});


module.exports = router;
