<template>
  <div class="min-h-screen flex flex-col bg-secondary text-text">
    <!-- fixed navbar on top -->
    <NavBar class="border-b border-primary-dark" />

    <!-- page content -->
    <main class="flex-1 container mx-auto p-6">
      <slot />
    </main>

    <!-- footer at bottom -->
    <Footer class="border-t border-primary-dark" />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
/* nothing here—pure Tailwind */
</style>
