import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('Weather Service Target:', process.env.services__apiservice__https__0 || process.env.services__apiservice__http__0);
console.log('Ollama Service Target:', process.env.services__ollamaservice__https__0 || process.env.services__ollamaservice__http__0);

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4001,
    proxy: {
      '/weather': {
        target: process.env.services__apiservice__https__0 || process.env.services__apiservice__http__0,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather/, ''),
        secure: false,
      },
      '/ollama': {
        target: process.env.services__ollamaservice__https__0 || process.env.services__ollamaservice__http__0,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
        secure: false,
      }
    },
  },
})
