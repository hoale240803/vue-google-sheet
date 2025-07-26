<template>
  <div
    v-if="message"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-40 transition-all duration-300 ease-in-out fade-in-out"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps(['message']);
</script>

<style scoped>
.fade-in-out {
  animation: fadeEffect 3s forwards;
}
@keyframes fadeEffect {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>