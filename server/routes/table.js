const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const {connection, insert, _delete, query, update} = require('../pool/pool'); // 引入数据库连接池
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const {signOptions, verifyOptions, secretKey, verify} = require('../config/jwt-config');

/* GET users listing. */
router.post('/getList', function (req, res, next) {
  console.log('|------------------------- getList -------------------------|');
  let {token} = req.body
  console.log('token =>', token);
  let sql = `select * from tables`
  let promise = query(sql);
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
    promise.then(result => {
      /*console.log(result);*/
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

  }).catch(err => {
    console.log(err)
    let resData = {
      code: 404,
    }
    res.send(resData)
  })
});


router.post('/deleteProject', function (req, res, next) {
  console.log('|------------------------- deleteProject -------------------------|');
  let {token, id} = req.body
  console.log('token, id =>', token, id);
  let sql = `DELETE FROM tables WHERE id=${id}`
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
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

  }).catch(err => {
    console.log(err)
    let resData = {
      code: 404,
    }
    res.send(resData)
  })
});

router.post('/updateProject', function (req, res, next) {
  console.log('|------------------------- updateProject -------------------------|');
  let {token, data} = req.body
  console.log('token,data =>', token, data);
  let {id, title, status, date, desc, author} = data
  console.log('date: ', date);
  date = date.split('T')[0]
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
    let updateSql = `update tables set title=\'${title}\',status=\'${status}\',date=\'${date}\', description=\'${desc}\', author=\'${author}\' where id=${id}`;
    let promise = query(updateSql);
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

  }).catch(err => {
    console.log(err)
    let resData = {
      code: 404,
    }
    res.send(resData)
  })
});

router.post('/createProject', function (req, res, next) {
  console.log('|------------------------- createProject -------------------------|');
  let {token, project} = req.body
  let {title, author, date, desc, status} = project
  date = date.split('T')[0];
  console.log({title, author, date, desc, status})
  // console.log('token, project =>', token, project);
  let insertSql = `insert into tables (title, status, author, date, description) values (\'${title}\',\'${status}\',\'${author}\',\'${date}\',\'${desc}\')`;
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
    let promise = query(insertSql);
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

  }).catch(err => {
    console.log(err)
    let resData = {
      code: 404,
    }
    res.send(resData)
  })
});

module.exports = router;
