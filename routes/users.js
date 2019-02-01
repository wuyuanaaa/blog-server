var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('./../models/userModel');

// 链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
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
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName || ''
      }
    })
  } else {
    res.json({
      status: '2',
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
        res.cookie("type", doc.type, {
          path: '/',
          maxAge: 1000*60*30
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000*60*30
        });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName,
            type: doc.type
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
  res.cookie("userName", "", {
    path: '/',
    maxAge: 0
  });
  res.cookie("type", "", {
    path: '/',
    maxAge: 0
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});


module.exports = router;
