import { createRouter, createWebHistory } from 'vue-router'
import UtilityCalculator from '../views/UtilityCalculator.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UtilityCalculator
    }
  ],
})

export default router
