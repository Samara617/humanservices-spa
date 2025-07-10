<template>
  <nav class="bg-blue-600 text-white p-4">
    <ul class="flex space-x-4 items-center">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/upload">Upload</router-link></li>
      <li><router-link to="/documents">Documents</router-link></li>

      <!-- if not logged in -->
      <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>

      <!-- if logged in -->
      <li v-else>
        <button
          @click="onLogout"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router    = useRouter()

// reactive flag for whether user is logged in
const isAuthenticated = computed(() => !!userStore.access)

function onLogout() {
  userStore.logout()          // clears tokens & header
  router.push('/login')       // send them to login (or '/')
}
</script>


<style scoped>
/* push page content below the fixed navbar */
:global(body) {
  padding-top: 3rem; /* match the nav height (py-3) */
}
</style>

