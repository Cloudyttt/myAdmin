//引入path模块
const path = require('path');

//path.join(__dirname)设置绝对路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath:'./',
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
    //set第一个参数：设置的别名，第二个参数：设置的路径

    config.module.rule('svg')
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .tap(options => {
        // 修改它的选项...
        options = {
          symbolId: 'icon-[name]',
          include: resolve('src/icon')
        }
        return options
      })
      .end()
      .use('file-loader')
      .tap(options => {
        // 修改它的选项...
        options = {
          limit: 10000,
          name: 'img/[name].[hash:8].[ext]',
          exclude: resolve('src/icon')
        }
        return options
      })
      .end()

  },
}
