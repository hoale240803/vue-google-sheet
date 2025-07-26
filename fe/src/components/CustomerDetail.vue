<template>
  <div v-if="customer" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Customer Details</h2>
        <button
          @click="closeDetails"
          class="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Customer Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Customer ID -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
          <div class="text-lg font-semibold text-gray-900">{{ customer.id }}</div>
        </div>

        <!-- Name -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div class="text-lg font-semibold text-gray-900">{{ customer.name }}</div>
        </div>

        <!-- Email -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div class="text-lg text-gray-900">{{ customer.email }}</div>
        </div>

        <!-- Phone -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div class="text-lg text-gray-900">{{ customer.phone }}</div>
        </div>

        <!-- Address -->
        <div class="bg-gray-50 p-4 rounded-lg md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div class="text-lg text-gray-900">{{ customer.address }}</div>
        </div>

        <!-- Transaction Amount -->
        <div class="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg md:col-span-2">
          <label class="block text-sm font-medium text-green-700 mb-2">Transaction Amount</label>
          <div class="text-2xl font-bold text-green-800">${{ customer.transactionAmount.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end mt-8 space-x-4">
        <button
          @click="editCustomer"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out"
        >
          Edit Customer
        </button>
        <button
          @click="closeDetails"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-150 ease-in-out"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerDetail',
  props: {
    customer: {
      type: Object,
      default: null
    }
  },
  methods: {
    closeDetails() {
      this.$emit('close-details');
    },
    editCustomer() {
      this.$emit('edit-customer', this.customer);
      this.closeDetails();
    }
  }
};
</script>

<style scoped>
/* Additional styles for modal overlay */
.modal-overlay {
  backdrop-filter: blur(2px);
}
</style>