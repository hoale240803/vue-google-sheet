<template>
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-8">
    <h2 class="text-2xl font-semibold text-gray-700 mb-6">{{ isEditing ? 'Edit Customer' : 'Add New Customer' }}</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          v-model="formCustomer.name"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter customer name"
          required
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="formCustomer.email"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter customer email"
          required
        />
      </div>
      <div>
        <label for="transactionAmount" class="block text-sm font-medium text-gray-700 mb-1">Transaction Amount</label>
        <input
          type="number"
          id="transactionAmount"
          name="transactionAmount"
          v-model.number="formCustomer.transactionAmount"
          step="0.01"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter transaction amount"
          required
        />
      </div>
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="number"
          id="phone"
          name="phone"
          v-model.number="formCustomer.phone"
          step="0.01"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter phone"
          required
        />
      </div>
      <div class="flex justify-end space-x-3">
        <button
          v-if="isEditing"
          type="button"
          @click="handleCancel"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel Edit
        </button>
        <button
          type="submit"
          class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          {{ isEditing ? 'Update Customer' : 'Add Customer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// CustomerForm Component
// Handles adding new customers and editing existing ones.
// Emits 'save-customer' and 'cancel-edit' events to the parent.
export default {
  name: 'CustomerForm',
  props: ['customerToEdit', 'isEditing'],
  data() {
    return {
      // Internal form state, initialized from props or new customer template
      formCustomer: { id: null, name: '', email: '', transactionAmount: null },
    };
  },
  watch: {
    // Watch for changes in customerToEdit prop to populate the form for editing
    customerToEdit: {
      handler(newVal) {
        if (newVal) {
          this.formCustomer = { ...newVal };
        } else {
          this.formCustomer = { id: null, name: '', email: '', transactionAmount: null };
        }
      },
      immediate: true, // Run handler immediately on component creation
      deep: true,      // Watch for nested property changes
    },
    // Watch for isEditing to reset the form when edit mode is cancelled externally
    isEditing(newVal) {
      if (!newVal && !this.customerToEdit) { // Only reset if not editing and no customer is selected
        this.resetForm();
      }
    }
  },
  methods: {
    // Handles form submission, performs validation, and emits 'save-customer'
    handleSubmit() {
      if (!this.formCustomer.name || !this.formCustomer.email || this.formCustomer.transactionAmount === null || this.formCustomer.transactionAmount === '') {
        this.$emit('show-message', 'Please fill in all customer fields.');
        return;
      }
      const amount = parseFloat(this.formCustomer.transactionAmount);
      if (isNaN(amount) || amount < 0) {
        this.$emit('show-message', 'Transaction amount must be a valid positive number.');
        return;
      }
      // Emit the customer data for saving/updating to the parent
      this.$emit('save-customer', { ...this.formCustomer, transactionAmount: amount });
      this.resetForm(); // Reset form after successful submission
    },
    // Resets the form inputs to their initial empty state
    resetForm() {
      this.formCustomer = { id: null, name: '', email: '', transactionAmount: null };
    },
    // Handles cancelling the edit operation, emits 'cancel-edit'
    handleCancel() {
      this.$emit('cancel-edit');
      this.resetForm(); // Reset form when cancelling
    }
  }
};
</script>