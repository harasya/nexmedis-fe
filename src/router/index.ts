import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import HomeView from '../views/HomeView.vue'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView, meta: { requiresAuth: true } },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresGuest: true },
    },
  ],
})

let isAuthChecked = false

router.beforeEach(async (to, from, next) => {
  if (!isAuthChecked) {
    await new Promise<void>((resolve) => {
      onAuthStateChanged(auth, () => {
        isAuthChecked = true
        resolve()
      })
    })
  }

  const user = auth.currentUser

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if (to.meta.requiresGuest && user && (to.path === '/login' || to.path === '/register')) {
    next('/')
  } else {
    next()
  }
})

export default router
