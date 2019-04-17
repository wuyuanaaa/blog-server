var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');

var User = require('./../models/userModel');

// 链接数据库
mongoose.connect('mongodb://blogAdmin:blog920602@127.0.0.1:27017/blog',{useNewUrlParser:true},function (err) {
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

// 用户登陆
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

// 用户登出
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

// github 登陆回调
router.get('/github', function (req, res, next) {
  let code = req.query.code;
  let url = "https://github.com/login/oauth/access_token?client_id=5c971effe02228b9a039&client_secret=57208a6138b5d49a070d457543a94c69ea3e4bf6&code=" + code;
  request(url, function (error, response, body) {
    let tokenUrl = 'https://api.github.com/user?'+ body;
    request({
      url: tokenUrl,
      headers: {
        'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
      }
    }, function (error, response, body) {
      res.json({
        status: '0',
        result: JSON.parse(body)
      })
    })
  })
});


module.exports = router;
