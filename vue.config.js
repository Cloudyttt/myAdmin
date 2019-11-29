//引入path模块
const path = require('path');

//path.join(__dirname)设置绝对路径
function resolve(dir){
  return path.join(__dirname, dir)
}

module.exports = {

  chainWebpack:(config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
    //set第一个参数：设置的别名，第二个参数：设置的路径
  }
}