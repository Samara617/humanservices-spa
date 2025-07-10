<template>
  <section class="flex items-center justify-center py-16">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold mb-4 text-primary-dark">Login</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="username" class="block text-text font-medium">Email</label>
          <input
            id="username"
            v-model="credentials.username"
            type="email"
            required
            class="w-full mt-1 px-3 py-2 border border-primary-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-text font-medium">Password</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="w-full mt-1 px-3 py-2 border border-primary-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-accent text-secondary py-2 rounded hover:bg-accent-dark disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router     = useRouter()
const userStore = useUserStore()

const credentials = reactive({ username: '', password: '' })
const error       = ref(null)
const loading     = ref(false)

const onSubmit = async () => {
  error.value   = null
  loading.value = true
  try {
    await userStore.login(credentials)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message
      || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Scoped overrides if you need them */
</style>
