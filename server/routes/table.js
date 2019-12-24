/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const fs = require('fs')
const {connection, insert, _delete, query, update} = require('../pool/pool') // 引入数据库连接池
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser")
const {signOptions, verifyOptions, secretKey, verify} = require('../config/jwt-config')
const {upload} = require('../pool/multer-config'); // 导入multer配置
/* GET users listing. */
router.post('/getList', function (req, res, next) {
  console.log('|------------------------- getList -------------------------|')
  let {token} = req.body
  console.log('token =>', token)
  let verifyPromise = verify(token)
  verifyPromise.then(decode => {
    console.log('decode', decode)
    let userId = decode.id
    let sql = `select * from tables where userId = ${userId}`
    let promise = query(sql);
    promise.then(result => {
      /*console.log(result);*/
      console.log(result[0]);
      let resData = {
        code: 200,
        author: decode.aud,
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


// 删除项目
router.post('/deleteProject', function (req, res, next) {
  console.log('|------------------------- deleteProject -------------------------|');
  let {token, id} = req.body
  console.log('token, id =>', token, id);

  // 验证用户token
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);

    let xlsQuerySql = `select * from xls where projectId = ${id}`
    let xlsDeletePromise = query(xlsQuerySql)
    xlsDeletePromise.then(result => {
      console.log('xls表中要删除的内容：', result[0]);
      fs.unlink(result[0].path, (err) => {
        if (err) throw err;
        console.log('文件已删除', result.path);
      });

      // 从项目表table删除项目
      let sql = `DELETE FROM tables WHERE id=${id}`
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
          info: '项目删除失败'
        }
        res.send(resData)
      });
    }).catch(err => {
      console.log(err);
      let resData = {
        code: 404,
        info: '没有查询到所要删除项目对应的xls表'
      }
      res.send(resData)
    })

  }).catch(err => {
    console.log(err)
    let resData = {
      code: 404,
      info: '用户Token认证失败'
    }
    res.send(resData)
  })
});

router.post('/updateProject', function (req, res, next) {
  console.log('|------------------------- updateProject -------------------------|');
  let {token, data} = req.body
  console.log('token,data =>', token, data);
  let {id, title, mapboxId, xlsAddr, xlsJson, meshJson} = data
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
    let updateSql = `update tables set title='${title}',mapboxId='${mapboxId}',xlsAddr='${xlsAddr}', xlsJson='${xlsJson}', meshJson='${meshJson}' where id=${id}`;
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

// 暂时用不到
router.post('/createProject', function (req, res, next) {
  console.log('|------------------------- createProject -------------------------|');
  let {token, project} = req.body
  let {id, title, mapboxId, xlsAddr, xlsJson, meshJson} = project
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
    let insertSql = `insert into tables (userId, mapboxId, title, xlsAddr, xlsJson, meshJson) values (${decode.id},'${mapboxId}','${title}','${xlsAddr}','${xlsJson}','${meshJson}')`;
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


// 新增项目
router.post('/xls', upload.single('file'), function (req, res, next) {
  console.log('|--------------------------------上传--------------------------------｜')
  let file = req.file
  let {fieldname, originalname, encoding, mimetype, destination, filename, path, size} = file
  let body = req.body
  console.log('body.token', body.token)
  console.log('file', file)
  console.log('body', body);
  let {title, mapboxId, meshJson, token} = body
  // console.log('title, mapboxId, meshJson,token:', title, mapboxId, meshJson, token);
  let verifyPromise = verify(token);
  verifyPromise.then(decode => {
    console.log('decode', decode);
    let insertSql = `insert into tables (userId, mapboxId, title, meshJson, xlsAddr,xlsJson) values (${decode.id},'${mapboxId}','${title}','${meshJson}', '${path}','${originalname}')`;
    let promise = query(insertSql);

    // 项目表able插入成功
    promise.then(result => {
      console.log('插入table表结果：', result);
      let newProject = result
      let projextId = result.insertId // 新建项目的ID
      console.log('projextId', projextId);

      // 插入xls表
      let xlsInsertSql = `insert into xls (projectId, fieldname, originalname, encoding, mimetype, destination, filename, path, size) values (${projextId},'${fieldname}','${originalname}', '${encoding}','${mimetype}', '${destination}','${filename}','${path}',${size})`;
      let xlsPromise = insert(xlsInsertSql)

      // 插入xls表成功
      xlsPromise.then(result => {
        console.log('插入xls表成功', result);
        // TODO:获取新插入的xls表数据，并传回客户端


        let resData = {
          code: 200,
          data: newProject
        }
        res.send(resData)
      }).catch(err => { // 插入xls表失败
        console.log(err)
        let resData = {
          code: 404,
          info: 'xls表插入插入失败'
        }
        res.send(resData)
      })
    }).catch(err => { // 项目表table插入失败
      console.log(err)
      let resData = {
        code: 404,
        info: 'table表插入失败！'
      }
      res.send(resData)
    });
  }).catch(err => {
    console.log(err)
    let resData = {
      code: 404,
      info: '用户Token认证失败！'
    }
    res.send(resData)
  })
});
module.exports = router;
