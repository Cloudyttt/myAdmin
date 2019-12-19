/* eslint-disable no-unused-lets */
// 生成一个路由实例用来捕获访问主页的GET请求，导出整个路由并在app.js中通过app.use('/',routes);加载。
// 这样，当访问主页时，就会调用res.render('index',{title:'Express'});渲染views/index.ejs模板并显示到浏览器中
const express = require('express');
const router = express.Router();
const child_process = require('child_process');
const exec = require('child_process').exec;
const execFile = child_process.execFile;

router.get('/', function (req, res, next) {
  (async function (params) {

    /*let ls = exec('ls -l', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
      }
      console.log('Child Process STDOUT: ' + stdout);
    });*/

    /*exec('node -v', function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      if(stderr){
        console.log('stderr: ' + stderr);
      }
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });*/

    let path = "/";
    execFile('/bin/ls', ['-l', path], function (err, result) {
      res.send(result)
      console.log(result)
    });

  })();
});
module.exports = router;

