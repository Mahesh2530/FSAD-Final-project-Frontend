// setupProxy.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all requests
app.use(cors());

// Proxy all API requests to the target server
app.use('/api', createProxyMiddleware({
  target: 'https://kvfdgmhh-2016.inc1.devtunnels.ms',
  changeOrigin: true,
  pathRewrite: {'^/api': '/api/v1'},
  onProxyRes: function (proxyRes) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(3000, () => {
  console.log('CORS Anywhere proxy running on port 3000');
});
