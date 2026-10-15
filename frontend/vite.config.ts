import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Resolve the workspace root (one level up from frontend/)
const workspaceRoot = path.resolve(import.meta.dirname, '..')

export default defineConfig({
  plugins: [react()],

  resolve: {
    // CRITICAL: Force a single React instance across all packages.
    // Without this, recharts bundles its own React and useMemo is null.
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: true,
    alias: {
      // Pin react and react-dom to the workspace root copy so recharts
      // and every other package share the exact same React object.
      react: path.resolve(workspaceRoot, 'node_modules/react'),
      'react-dom': path.resolve(workspaceRoot, 'node_modules/react-dom'),
    },
  },

  server: {
    port: 5173,
    strictPort: false,
    fs: {
      allow: [import.meta.dirname, workspaceRoot],
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'recharts',
      'lucide-react',
    ],
  },
})
