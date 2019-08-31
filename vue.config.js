
const backend = 'http://data-manage-backend-dev.henshihui.com'

module.exports = {
  // cli3 代理是从指定的target后面开始匹配的，不是任意位置；配置pathRewrite可以做替换
  devServer: {
    proxy: {
      '/user': {
        target: backend,
        changeOrigin: true
      },
      '/amount': {
        target: 'http://admin-dev.idouzi.com',
        changeOrigin: true,
        pathRewrite: {
          // '^/amount': '/amount'
        }
      },
      '/upload': {
        target: 'http://medialibs-dev.idouzi.com/api',
        changeOrigin: true,
        pathRewrite: {
          // '^/upload': '/upload'
        }
      },
      '/basic': {
        target: backend,
        changeOrigin: true
      },
      '/goods': {
        target: backend,
        changeOrigin: true
      }
    }
  }
}
