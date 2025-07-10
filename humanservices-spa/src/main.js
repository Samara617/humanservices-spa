import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/tailwind.css'
import api from '@/services/api'

const saved = localStorage.getItem('access')
if (saved) {
  // Re‐apply the header so axios carries it on every request
  api.setAuthToken(saved)
}

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
