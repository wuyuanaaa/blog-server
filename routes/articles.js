var express = require('express');
var router = express.Router();
var Article = require('../models/articleModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://blogAdmin:920602@127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!') }
});

/* GET home page. */
router.get('/list', function(req, res) {
  Article.find({},function (err, docs) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(docs)
  })
});

// 获取单篇文章
router.get('/single', function(req, res) {
  var count;
  Article.find({_id: req.query._id},function (err, docs) {
    if (err) {
      console.log(err);
      return;
    }
    count = docs.readCount + 1;
    res.json(docs)
  });
  Article.update({_id: req.query._id},{$inc:{readCount: 1}},function (err, docs) {
    if (err) {
      console.log(err);
    }
  })
});


// 添加文章
router.post('/save', function (req, res) {
  new Article(req.body.data).save(function (err) {
    if (err) {
      res.status(500).send();
      return
    }
    res.send({
      status: 200
    });
  })
});


module.exports = router;
