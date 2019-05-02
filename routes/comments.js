var express = require('express');
var router = express.Router();
var Comments = require('../models/commentModel');
var Articles = require('../models/articleModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://blogAdmin:blog920602@127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!') }
});

// 验证权限
function check (req, res, next) {
  if (req.cookies.userName) {
    let userCookies = req.cookies;
    // 有操作则延长 cookie 时间
    res.cookie("type", userCookies.type, {
      path: '/',
      maxAge: 1000*60*30
    });
    res.cookie("userName", userCookies.userName, {
      path: '/',
      maxAge: 1000*60*30
    });

    if(parseInt(userCookies.type) !== 823) {
      res.json({
        status: '3',
        msg: '没有该权限！',
        result: ''
      });
    } else {
      next();
    }
  } else {
    res.json({
      status: '2',
      msg: '未登录',
      result: ''
    });
  }
}

// 保存一级评论
router.post('/save_comment', function (req, res) {
  new Comments(req.body).save(function (err) {
    if (err) {
      res.status(500).send();
      return;
    }
    res.send({
      status: '0'
    });
    // 更新对应文章评论数
    let _id = req.body.article_id;
    Articles.update({_id: _id},{$inc: {commentCount: 1}}, function (err, doc) {
      if (err) {
        console.log(err);
      }
    })
  })
});

// 保存二级评论
router.post('/save_follow_comment', function (req, res) {
  Comments.update({_id: req.body.follow_id},{$push:{comment_follow: req.body}}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      res.json({
        status: '0'
      });
      // 找到对应文章 _id
      Comments.findOne({_id: req.body.follow_id}, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        let _id = doc.article_id;
        // 更新评论数
        Articles.update({_id: _id},{$inc: {commentCount: 1}}, function (err, doc) {
          if (err) {
            console.log(err);
          }
        })
      })
    }
  })
});

// 删除一级评论
router.post('/remove_comment', function (req, res) {
  check(req, res, () => {
    let _id = req.body._id;

    // 找到评论
    Comments.findOne({_id: _id}, function (err, doc) {
      if (err) {
        console.log(err);
        return;
      }
      let totalComment = doc.comment_follow.length + 1;
      let article_id = doc.article_id;
      // 删除评论
      Comments.remove({_id: _id}, function (err) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0'
          });
          // 更新评论数
          Articles.update({_id: article_id},{$inc: {commentCount: -totalComment}}, function (err, doc) {
            if (err) {
              console.log(err);
            }
          })
        }
      });

    });

  });
});

// 删除二级评论
router.post('/remove_follow_comment', function (req, res) {
  check(req, res, () => {
    let _id = req.body._id;
    let top_id = req.body.top_id;

    Comments.update({_id: top_id}, {$pull:{comment_follow: {_id: _id}}}, function (err) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0'
        });
        // 找到对应文章 _id
        Comments.findOne({_id: top_id}, function (err, doc) {
          if (err) {
            console.log(err);
            return;
          }
          let _id = doc.article_id;
          // 更新评论数
          Articles.update({_id: _id},{$inc: {commentCount: -2}}, function (err, doc) {
            if (err) {
              console.log(err);
            }
          })
        })
      }
    })
  });
});


// 获取单篇文章评论数据
router.get('/get_comments', function (req, res) {
  let comments = Comments.find({article_id: req.query.article_id});

  comments.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err
      });
      return;
    }
    res.json({
      status: '0',
      result: doc
    });
  });
});



module.exports = router;
