import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2025,
    cors: true,
    proxy: {
      // Proxy all API requests to local Spring Boot server
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Private-Network': 'true',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            
            // If the API request fails with a 4xx/5xx status code, log it but don't block
            // This allows the application to continue and fall back to mock data
            if (proxyRes.statusCode >= 400) {
              console.warn(`API request failed with status ${proxyRes.statusCode}: ${req.url}`);
            }
          });
        }
      }
    }
  },
})
