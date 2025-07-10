<template>
  <section class="flex items-center justify-center py-16">
    <div class="w-full max-w-md bg-secondary rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold mb-4 text-primary-dark">Register</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-text font-medium">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full mt-1 px-3 py-2 border border-primary-light rounded focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label for="password" class="block text-text font-medium">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full mt-1 px-3 py-2 border border-primary-light rounded focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label for="confirm" class="block text-text font-medium">Confirm Password</label>
          <input
            id="confirm"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full mt-1 px-3 py-2 border border-primary-light rounded focus:ring-2 focus:ring-primary"
          />
        </div>
        <p v-if="error" class="text-red-600">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-accent text-secondary py-2 rounded hover:bg-accent-dark disabled:opacity-50"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router  = useRouter()
const form    = reactive({ email: '', password: '', confirmPassword: '' })
const error   = ref(null)
const loading = ref(false)

async function onSubmit() {
  error.value = null
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await api.register({
      email:    form.email,
      password: form.password
    })
    router.push('/login')
  } catch (err) {
    // show any field errors or a generic message
    error.value = err.response?.data?.email 
      ? err.response.data.email[0] 
      : 'Registration failed.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tailwind handles the styling */
</style>
