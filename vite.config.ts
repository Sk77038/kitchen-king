import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // This allows us to access VITE_API_KEY during build time.
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Securely inject the API key as a string constant during build.
      // This works even if import.meta.env is not supported in the target environment.
      // We check both VITE_API_KEY and API_KEY to be safe.
      'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || "")
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1600,
    },
    server: {
      port: 3000
    }
  };
});