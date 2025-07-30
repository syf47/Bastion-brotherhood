import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  const { VITE_API_BASE_URL: BASE_URL, VITE_API_SERVER_URL: SERVER_URL } = env

  return {
    plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@type': fileURLToPath(new URL('./src/types', import.meta.url)),
      },
    },
    server: {
      proxy: {
        [BASE_URL]: {
          target: SERVER_URL,
          changeOrigin: false,
          rewrite: (path) => path.replace(new RegExp(`^${BASE_URL}`), ''),
        },
      },
    },
  }
})
