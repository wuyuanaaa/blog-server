var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('./../models/userModel');

// 链接数据库
mongoose.connect('mongodb://blogAdmin:920602@127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!') }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 检查登录状态
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName || ''
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

router.post('/login', function (req, res, next) {
  var param = {$and:[
      {userName: req.body.userName},
      {userPwd: req.body.userPwd}
    ]
  };
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000*60*60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000*60*60
        });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      } else {
        res.json({
          status: '1',
          msg: '帐号或者密码错误'
        })
      }
    }
  })
});

router.post('/logout', function (req, res, next) {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})


module.exports = router;
