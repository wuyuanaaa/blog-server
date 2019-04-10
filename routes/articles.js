var express = require('express');
var router = express.Router();
var Articles = require('../models/articleModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://blogAdmin:blog920602@127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
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
      let articlesModel = Articles.find(params,{title:true,tags:true,date:true,lastDate: true,abstract:true,readCount:true,type:true}).sort({date:-1}).skip(skip).limit(pageSize);
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
    }
  });

});


// 获取单篇文章
router.get('/single', function(req, res) {
  Articles.find({_id: req.query._id},function (err, doc) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(doc)
  });

  Articles.update({_id: req.query._id},{$inc:{readCount: 1}},function (err, doc) {
    if (err) {
      console.log(err);
    }
  })
});

// 获取上一篇
router.get('/prev', function (req, res) {
  let prev = Articles.find({date: {$lt: req.query.date}, type: {$ne:1}},{title: true, _id:true}).sort({date:-1}).limit(1);

  prev.exec(function (err, doc) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(doc);
  });

});

// 获取下一篇
router.get('/next', function (req, res) {
  let next = Articles.find({date: {$gt: req.query.date}, type: {$ne:1}},{title: true, _id:true}).limit(1);

  next.exec(function (err, doc) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(doc);
  });
});



// 获取标签所有文章
router.get('/tag', function(req, res) {
  let tagModel = Articles.find({tags: req.query.tag},{title:true,date:true}).sort({date:-1});

  tagModel.exec(function (err, doc) {
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
          list: doc
        }
      })
    }
  });

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
});


module.exports = router;
