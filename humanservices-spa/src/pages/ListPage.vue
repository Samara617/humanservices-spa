<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const documents = ref([])
const error     = ref(null)
const loading   = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await api.fetchDocuments()
    documents.value = data
  } catch (err) {
    error.value = 'Failed to load documents.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Your Documents</h1>
    <p v-if="error" class="text-red-600">{{ error }}</p>
    <ul v-if="!loading">
      <li v-for="doc in documents" :key="doc.id">
        {{ doc.category }} — {{ doc.file }} ({{ new Date(doc.uploaded).toLocaleString() }})
      </li>
    </ul>
    <p v-else>Loading…</p>
  </div>
</template>

