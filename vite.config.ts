import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use process.cwd() directly since this runs in Node environment where process is defined
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Inject API Key safely. If missing, defaults to empty string.
      // We explicitly access env.API_KEY to ensure it's picked up from environment variables
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    },
    build: {
      outDir: 'dist',
    }
  };
});