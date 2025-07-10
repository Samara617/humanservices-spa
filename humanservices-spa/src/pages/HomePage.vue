<template>
  <div class="min-h-screen flex flex-col">
    <!-- Keep your NavBar above the hero -->
    <NavBar />

    <!-- Hero Section with gradient & overlay -->
    <div class="relative flex-1">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-800"></div>
      <div
        class="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 py-24"
      >
        <h1
          class="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4 animate-fadeIn"
        >
          Empowering Your Future
        </h1>
        <p
          class="text-lg md:text-xl mb-8 drop-shadow-sm animate-fadeIn delay-200"
        >
          Securely upload and manage your critical documents with confidence.
        </p>
        
      </div>
    </div>

    <Footer />
  </div>
</template>


<style scoped>
/* Simple fade-in animation for hero text */
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 1s ease-out forwards;
}
.delay-200 {
  animation-delay: 0.2s;
}
</style>

