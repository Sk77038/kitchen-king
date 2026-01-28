import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We use (process as any).cwd() to avoid TS errors if types are missing
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This allows the app to access process.env.API_KEY in the browser
      // It falls back to an empty string if not found, preventing "undefined" errors
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || "")
    },
    build: {
      outDir: 'dist',
    }
  };
});