import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  // .obj is intentionally excluded — LVM3ModelViewer uses explicit ?url imports,
  // which work without assetsInclude and avoid a duplicate Vite pipeline pass.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Raise warning threshold since LVM3 textures are intentionally large static assets
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js and its examples into one async chunk
          'vendor-three': ['three'],
          // Framer/Motion into its own chunk
          'vendor-motion': ['motion/react'],
        },
      },
    },
  },
})

