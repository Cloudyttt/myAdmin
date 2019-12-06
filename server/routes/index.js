// 生成一个路由实例用来捕获访问主页的GET请求，导出整个路由并在app.js中通过app.use('/',routes);加载。
// 这样，当访问主页时，就会调用res.render('index',{title:'Express'});渲染views/index.ejs模板并显示到浏览器中
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {

  (async function (params) {
    res.send('index')
  })();
});
module.exports = router;

