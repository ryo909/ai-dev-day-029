import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages 用: 環境変数 VITE_BASE でリポジトリ名を設定
  // 例: VITE_BASE=/ai-dev-day-001/ npm run build
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
