// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser')
// 引入数据库连接池塘
const pool = require('./pool/pool');
pool.connectMySQL(); // 启动数据库连接
// 加载路由控制
let indexRouter = require('./routes/index');
let appendRouter = require('./routes/append');
let writeRouter = require('./routes/write');
let readRouter = require('./routes/read');
let readRouter_gov = require('./routes/read_gov');
let usersRouter = require('./routes/users');
// 创建项目实例
let app = express();
app.use(bodyParser.urlencoded({extended:false}));
// CORS跨域
let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,x-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  next()
};
app.use(allowCrossDomain);


/*
* app.set(name,value): 把名字为name的项的值设为value，用于设置参数。
* app.use([path], function): 用这个方法来使用中间件，因为express依赖于connect，有大量的中间件，可以通过app.use来使用；path参数可以不填，默认为'/'
* app.get(name): 获取名为name的项的值。
* */



// view engine setup
// 设置views文件夹为存放视图文件的目录，即存放模板文件的地方
// dirname为全局变量，存储当前正在执行的脚本所在的目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 加载日志中间件
app.use(logger('dev'));
// 加载解析json的中间件
app.use(express.json());
// 加载解析urlencoded请求体的中间件
app.use(express.urlencoded({extended: false}));
// 加载解析cookie的中间件
app.use(cookieParser());
// 设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制器
app.use('/', indexRouter);
// 增加一条路由规则
app.use('/append', appendRouter);
app.use('/write', writeRouter);
app.use('/read', readRouter);
app.use('/read_gov', readRouter_gov);
app.use('/users', usersRouter);

// 捕获404错误，并转发到错误处理器
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 生产环境，500错误处理
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // 开发环境下的错误处理器，将错误信息渲染error模板并显示到浏览器中
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 输出模型app
module.exports = app;
