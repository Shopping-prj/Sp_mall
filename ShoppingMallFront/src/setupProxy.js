const { createProxyMiddleware } = require('http-proxy-middleware')
//3000번에서 8000번으로 요청할 때 도 proxy 미포함처리하고
//8000번에서 요청을 받을 때도 proxy미포함 한다.
module.exports = function(app) {
  app.use(
    '/proxy',
    createProxyMiddleware({
      target: 'http://localhost:8001',
      changeOrigin: true,
      rewrite: {'^/proxy':''},
    }),
  );
}