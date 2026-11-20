import react from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // StyleX must run before the React plugin to keep Fast Refresh working.
  plugins: [stylex.vite({ useCSSLayers: true }), react()],
})
