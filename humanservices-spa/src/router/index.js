import { createRouter, createWebHistory } from 'vue-router'
import HomePage      from '@/pages/HomePage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import LoginPage     from '@/pages/LoginPage.vue'
import RegisterPage  from '@/pages/RegisterPage.vue'
import UploadPage    from '@/pages/UploadPage.vue'
import ListPage      from '@/pages/ListPage.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  // PUBLIC
  { path: '/',          component: HomePage },
  { path: '/login',     component: LoginPage },
  { path: '/register',  component: RegisterPage },

  // AUTHENTICATED
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/upload',    component: UploadPage,   meta: { requiresAuth: true } },
  { path: '/documents', component: ListPage,     meta: { requiresAuth: true } },

  // catch-all
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// global guard: redirect to login if a protected route is hit while not logged in
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (to.meta.requiresAuth && !store.access) {
    return next('/login')
  }
  next()
})

export default router
