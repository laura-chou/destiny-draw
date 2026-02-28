import { createRouter, createWebHashHistory  } from 'vue-router'
import { usePrizeStore } from '@/store/prizes'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/settings'
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/History.vue')
    },
    {
      path: '/grid',
      name: 'grid',
      component: () => import('@/views/GridLottery.vue')
    },
    {
      path: '/slot',
      name: 'slot',
      component: () => import('@/views/SlotMachine.vue')
    },
    {
      path: '/scratch',
      name: 'scratch',
      component: () => import('@/views/ScratchCard.vue')
    },
    {
      path: '/wheel',
      name: 'wheel',
      component: () => import('@/views/Wheel.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const prizeStore = usePrizeStore()
  const allowedRoutes = ['/settings', '/history']
  if (!allowedRoutes.includes(to.path) && prizeStore.availablePrizes.length < 2) {
    next({ name: 'settings' })
  } else {
    next()
  }
})

export default router
