import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()

// may use some plugins here
// store.use(plugin)

export function setupStore(app: App) {
  app.use(store)
}
