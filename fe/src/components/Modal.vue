<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>