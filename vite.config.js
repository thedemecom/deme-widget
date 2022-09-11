import { defineConfig } from 'vite';
import { million } from 'million/vite-plugin-million';
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]

  // plugins: [million({ react: true })],
});
