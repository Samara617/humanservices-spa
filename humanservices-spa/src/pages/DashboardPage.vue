<template>
  <section class="container mx-auto p-6">
    <!-- Page Header -->
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold text-primary-dark animate-fadeIn">Dashboard Overview</h1>
      <p class="text-lg text-text animate-fadeIn delay-200">Quick stats and recent activity</p>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div
        class="p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition animate-fadeIn"
        style="background: linear-gradient(135deg, theme('colors.indigo.500'), theme('colors.pink.500'))"
      >
        <h2 class="text-xl font-semibold text-white">Total Uploads</h2>
        <p class="mt-2 text-3xl font-bold text-white">{{ total }}</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition animate-fadeIn delay-100"
        style="background: linear-gradient(135deg, theme('colors.green.400'), theme('colors.green.700'))"
      >
        <h2 class="text-xl font-semibold text-white">Pending</h2>
        <p class="mt-2 text-3xl font-bold text-white">{{ statusCount('Pending') }}</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition animate-fadeIn delay-200"
        style="background: linear-gradient(135deg, theme('colors.yellow.400'), theme('colors.yellow.600'))"
      >
        <h2 class="text-xl font-semibold text-white">Approved</h2>
        <p class="mt-2 text-3xl font-bold text-white">{{ statusCount('Approved') }}</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition animate-fadeIn delay-300"
        style="background: linear-gradient(135deg, theme('colors.red.400'), theme('colors.red.600'))"
      >
        <h2 class="text-xl font-semibold text-white">Rejected</h2>
        <p class="mt-2 text-3xl font-bold text-white">{{ statusCount('Rejected') }}</p>
      </div>
    </div>

    <!-- Category Distribution Badges -->
    <div class="bg-secondary p-6 rounded-lg shadow-md mb-12 animate-fadeIn delay-400">
      <h2 class="text-2xl font-semibold mb-4 text-primary-dark">By Category</h2>
      <div class="flex flex-wrap gap-4">
        <span
          v-for="(count, cat) in categoryCounts"
          :key="cat"
          class="px-4 py-2 rounded-full text-secondary font-medium"
          :class="{
            'bg-indigo-500': cat==='paystub',
            'bg-green-500': cat==='bank_statement',
            'bg-purple-500': cat==='birth_certificate',
            'bg-gray-500': cat==='other'
          }"
        >
          {{ cat }}: {{ count }}
        </span>
      </div>
    </div>

    <!-- Recent Documents Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-md animate-fadeIn delay-600">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-primary-light">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Uploaded</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-secondary divide-y divide-gray-100">
          <tr v-for="doc in recentDocuments" :key="doc.id">
            <td class="px-6 py-4 text-text capitalize">{{ doc.category }}</td>
            <td class="px-6 py-4">
              <span
                :class="{
                  'text-yellow-600': doc.status==='Pending',
                  'text-green-600': doc.status==='Approved',
                  'text-red-600': doc.status==='Rejected'
                }"
                class="font-semibold"
              >
                {{ doc.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-text">{{ new Date(doc.uploaded).toLocaleString() }}</td>
            <td class="px-6 py-4">
              <button
                @click="download(doc.id)"
                class="px-4 py-2 bg-primary-dark text-white rounded hover:bg-primary-dark/90"
              >
                Download
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const docs = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch on mount
onMounted(async () => {
  loading.value = true
  try {
    const { data } = await api.fetchDocuments()
    docs.value = data
  } catch (e) {
    error.value = 'Failed to load documents'
  } finally {
    loading.value = false
  }
})

// Summary
const total = computed(() => docs.value.length)
function statusCount(status) {
  return docs.value.filter(d => d.status === status).length
}

// Category counts
const categoryCounts = computed(() => {
  return docs.value.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1
    return acc
  }, {})
})

// Recent documents (e.g., first 5)
const recentDocuments = computed(() => docs.value.slice(0, 5))

// Download handler stub
async function download(id) {
  try {
    const { data } = await api.downloadDocument(id)
    window.open(data.url, '_blank')
  } catch {
    alert('Download failed')
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-600 { animation-delay: 0.6s; }
</style>
