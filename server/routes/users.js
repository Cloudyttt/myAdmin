/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const {connection, insert, _delete, query, update} = require('../pool/pool'); // 引入数据库连接池
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const {signOptions, verifyOptions, secretKey} = require('../config/jwt-config');


/* GET users listing. */
router.post('/query', function (req, res, next) {
  let data = req.body;
  let {token} = data;
  console.log('token', token);
  jwt.verify(token, secretKey, verifyOptions, (err, decode) => {
    if (err) {
      console.log('err', err);
      let resData = {
        code: 500 // 验证令牌失败
      }
      res.send(resData)
    } else {
      let sql = `select * from users`
      let promise = query(sql);
      promise.then(result => {
        console.log(result);
        let resData = {
          code: 200,
          data: result
        }
        res.send(resData)
      }).catch(err => {
        console.log(err)
        let resData = {
          code: 404,
        }
        res.send(resData)
      });
    }

  });
});

router.post('/login', async function (req, res, next) {
  console.log('|----------------------------- login -----------------------------|');
  let data = req.body;
  console.log('data', data);
  let username = data.username;
  let password = data.password;
  let sql = `select * from users where username = '${username}' and password = '${password}'`;
  let promise = query(sql);
  let resData = {}
  // 查询数据库
  await promise.then(result => {
    // 查询数据库成功！
    if (result.length !== 0) {
      let id = result[0].id // 用户id
      let username = result[0].username // 用户名

      // JWT验证
      // JWT有效负荷
      let payload = {
        iss: 'Cloudy',
        aud: username,
        id: id,
      }
      // 异步JWT生成令牌
      jwt.sign(payload, secretKey, signOptions, (err, token) => {
        if (err) {
          console.log('err', err);
          resData = {
            code: 500 // 生成令牌失败
          }
          res.send(resData)
        } else { // 成功生成令牌，正常返回令牌
          resData = {
            code: 200,
            token,
          }
          console.log('resData', resData);
          res.send(resData)
        }
      });
    } else { // 查询数据库失败！
      resData = {
        code: 404 // 资源不存在
      }
      res.send(resData)
    }
  }).catch(err => {
    console.log(err)
    resData = {
      code: 500 // 请求时发生了错误
    }
    res.send(resData)
  });
});

router.post('/getInfo', function (req, res, next) {
  let data = req.body;
  console.log('|----------------------------- getInfo -----------------------------|');
  console.log('data', data);
  let token = data.token;
  // JWT验证
  jwt.verify(token, secretKey, verifyOptions, (err, decode) => {
    if (err) {
      console.log('err', err);
      let resData = {
        code: 500 // 令牌错误，需要验证用户
      }
      res.send(resData)
    } else {
      console.log('decode:', decode);
      let sql = `select * from users where id = ${decode.id}`;
      let promise = query(sql);
      promise.then(result => {
        let resData = {
          code: 200,
          data: result[0]
        }
        console.log('resData', resData);
        res.send(resData)
      }).catch(err => {
        console.log(err)
        let resData = {
          code: 404 //
        }
        res.send(resData)
      });
    }
  })


});

router.post('/logout', function (req, res, next) {
  console.log('|----------------------------- logout -----------------------------|');
  let data = req.body;
  console.log('data', data);
  let {token} = data;
  let resData = token ? {code: 200} : {code: 500};
  res.send(resData)
});


/*// 更新数据
router.get('/update', function (req, res, next) {
  let data = JSON.parse(req.query.data);
  console.log(data);
  let title = data.title;
  let language = data.lang;
  let uptime = data.uptime;
  let likes = parseInt(data.likes);
  let id = data.articleID;

  // 更新数据库
  let updateSql = `update articles set title=\'${title}\',lang=\'${language}\',updateTime=\'${uptime}\', likes=${likes} where id=${id}`;
  console.log('updateSql: ', updateSql);

  let promise = update(updateSql);
  promise.then(result => {
    console.log(result);
    res.send(result)
  }).catch(err => {
    console.log(err)
  });
});

// 插入数据
router.get('/insert', function (req, res, next) {
  let data = JSON.parse(req.query.data);
  console.log(data);
  let title = data.title;
  let language = data.lang;
  let uptime = data.uptime;
  let likes = parseInt(data.likes);
  // 插入数据库
  let insertSql = `insert into articles (title, lang, uploadTime, updateTime, likes) values (\'${title}\',\'${language}\',\'${uptime}\',\'${uptime}\',${likes})`;
  console.log('insertSql: ', insertSql);

  let promise = insert(insertSql);
  promise.then(result => {
    console.log(result);
    res.send(result.insertId)
  }).catch(err => {
    console.log(err)
  });
});


router.get('/delete', function (req, res, next) {
  console.log('删除');
  let id = JSON.parse(req.query.id);
  console.log(id);
  let insertSql = `DELETE FROM articles WHERE id=${id}`;
  console.log('insertSql: ', insertSql);
  let promise = _delete(insertSql);
  promise.then(result => {
    console.log(result);
    res.send(result)
  }).catch(err => {
    console.log(err)
  });

})
;*/

module.exports = router;
