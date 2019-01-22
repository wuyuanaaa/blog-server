var express = require('express');
var router = express.Router();
var Articles = require('../models/articleModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://blogAdmin:920602@127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!') }
});

/* 获取文章列表 */
router.get('/list', function(req, res) {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let all = req.query.all;

  let skip = (page-1)*pageSize;
  let params = all === '1' ? {} : {type: {$ne:1}};

  let total;
  Articles.countDocuments({},function (err, count) {
    if(err) {
      res.json(err)
    } else {
      total = count;
    }
  });
  let articlesModel = Articles.find(params).skip(skip).limit(pageSize);

  articlesModel.exec(function (err, doc) {
    if (err) {
      console.log(err);
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          total: total,
          count: doc.length,
          list: doc
        }
      })
    }
  });

});


// 获取单篇文章
router.get('/single', function(req, res) {
  var count;
  Articles.find({_id: req.query._id},function (err, doc) {
    if (err) {
      console.log(err);
      return;
    }
    count = doc.readCount + 1;
    res.json(doc)
  });
  Articles.update({_id: req.query._id},{$inc:{readCount: 1}},function (err, doc) {
    if (err) {
      console.log(err);
    }
  })
});


// 添加文章
router.post('/save', function (req, res) {
  new Articles(req.body).save(function (err) {
    if (err) {
      res.status(500).send();
      return
    }
    res.send({
      status: '0'
    });
  })
});

// 修改文章
router.post('/change', function (req, res) {
  let _id = req.body._id;
  let newData = req.body.newData;

  Articles.update({_id: _id},{$set:newData},function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
});

// 删除文章
router.post('/remove', function (req, res) {
  let _id = req.body._id;

  Articles.remove({_id: _id}, function (err) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})


module.exports = router;
