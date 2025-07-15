import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'

import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      name: 'Layout',
      redirect: 'Home',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('@/views/home/index.vue'),
        },
      ],
    },
  ],
})

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
