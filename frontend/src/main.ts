import './assets/main.css'
import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)
  await setupRouter(app)

  app.mount('#app')
}

// Welcome to Bastion Brotherhood!
bootstrap()
