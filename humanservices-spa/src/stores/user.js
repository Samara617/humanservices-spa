// src/stores/user.js
import { defineStore } from 'pinia'
import api from '@/services/api'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    access: localStorage.getItem('access') || null,
    refresh: localStorage.getItem('refresh') || null,
    user: null,
  }),
actions: {
    async login(credentials) {
      const data = await api.login(credentials)
      // data.access is the JWT
      this.access = data.access
      this.refresh = data.refresh
      // Persist tokens to localStorage
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      // ← Immediately set the header on axios
      api.setAuthToken(data.access)
    },
    logout() {
      this.access = this.refresh = null
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})
