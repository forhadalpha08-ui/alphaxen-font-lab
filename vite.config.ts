import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
        watch: {
          ignored: ['**/fonts/**', '**/.git/**', '**/*.zip']
        },
        proxy: {
          '^/(login|register|versioncheck|getvariable|getvariables|create_user|delete_user|reset_hwid|create_license|delete_license|create_app|delete_app)': {
            target: 'http://127.0.0.1:8787',
            changeOrigin: true,
          }
        }
      },
      plugins: [
        react(),
        {
          name: 'alphaxen-font-drm-guard',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              const url = req.url || '';
              // Block direct unauthorized scraping of raw font binaries
              if (url.match(/\/fonts\/.*\.(otf|ttf|woff|woff2|zip|py|pyc)$/i)) {
                // If not signed by auth header/token
                const authHeader = req.headers['x-alphaxen-token'] || req.headers['authorization'];
                if (!authHeader) {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: 'DRM_PROTECTED_ASSET',
                    message: 'Alphaxen Anti-Theft Guard: Direct binary download blocked. Valid buyer license signature required.'
                  }));
                  return;
                }
              }
              next();
            });
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
