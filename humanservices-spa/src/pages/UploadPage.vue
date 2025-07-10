<template>
  <section class="py-16">
    <div class="max-w-lg mx-auto bg-secondary rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-4 text-primary-dark">Upload Document</h1>

      <div class="space-y-4">
        <!-- Category -->
        <div>
          <label class="block text-text font-medium mb-1">Category</label>
          <select
            v-model="category"
            class="w-full px-3 py-2 border border-primary-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="paystub">Paystub</option>
            <option value="bank_statement">Bank Statement</option>
            <option value="birth_certificate">Birth Certificate</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- File Input -->
        <div>
          <label class="block text-text font-medium mb-1">Select File</label>
          <input type="file" @change="onFileChange" />
          <p v-if="file" class="mt-2 text-sm text-text">
            Selected: {{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }} MB)
          </p>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-600">{{ error }}</p>

        <!-- Upload Button -->
        <button
          @click="upload"
          :disabled="uploading"
          class="w-full bg-accent text-secondary py-2 rounded hover:bg-accent-dark disabled:opacity-50"
        >
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const file = ref(null)
const category = ref('other')
const error = ref('')
const uploading = ref(false)

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function upload() {
  error.value = ''
  if (!file.value) {
    error.value = 'Please select a file first.'
    return
  }

  uploading.value = true
  try {
    // 1) Ask Django for the presigned URL
    const { data } = await api.initUpload({
      file_name: file.value.name,
      file_type: file.value.type,
      category: category.value
    })
    const upload_url = data.upload_url
    const doc_id = data.doc_id

    // 2) PUT the file directly to S3
    const res = await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.value.type,
        'x-amz-server-side-encryption': 'AES256'
      },
      body: file.value
    })
    if (!res.ok) throw new Error(`S3 upload failed: ${res.statusText}`)

    // 3) On success, clear the form (or redirect)
    file.value = null
    category.value = 'other'
    alert(`Upload successful (document ID: ${doc_id})`)
  } catch (err) {
    error.value = err.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
/* no extra CSS needed—Tailwind handles it */
</style>
