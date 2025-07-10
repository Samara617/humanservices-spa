// src/services/api.js
import axios from 'axios'
import router from '@/router'   // to redirect if refresh also fails

// base URL
axios.defaults.baseURL = 'http://localhost:8000'

// attach access token on demand
export function setAuthToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// response interceptor to handle expired tokens
axios.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config
    const status   = error.response?.status
    const code     = error.response?.data?.code

    // if 401 due to expired access token, and we haven't retried yet:
    if (status === 401 && code === 'token_not_valid' && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh')
      if (refresh) {
        try {
          // 1) ask Django for a new access token
          const { data } = await axios.post('auth/refresh/', { refresh })
          const newAccess = data.access

          // 2) persist & re-attach
          localStorage.setItem('access', newAccess)
          setAuthToken(newAccess)

          // 3) retry the original request
          original.headers['Authorization'] = `Bearer ${newAccess}`
          return axios(original)
        } catch (refreshError) {
          // refresh also failed: redirect to login
          router.push('login')
          return Promise.reject(refreshError)
        }
      } else {
        // no refresh token: go back to login
        router.push('login')
      }
    }

    return Promise.reject(error)
  }
)

// Auth methods
export function register(payload) {
  return axios.post('auth/register/', payload)
}

export async function login(credentials) {
  const { data } = await axios.post('auth/login/', credentials)
  // save both tokens
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  setAuthToken(data.access)
  return data
}

// Document methods
export function initUpload(payload) {
  return axios.post('documents/init-upload/', payload)
}
export function fetchDocuments() {
  return axios.get('documents/my-docs/')
}

export default {
  setAuthToken,
  register,
  login,
  initUpload,
  fetchDocuments
}
