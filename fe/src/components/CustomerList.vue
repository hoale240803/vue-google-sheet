<template>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-x-auto border dark:border-gray-700 transition-colors duration-300">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Customer List</h2>
      <p v-if="customers.length === 0" class="text-center text-gray-500 dark:text-gray-400">No customers found matching your criteria.</p>
      <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-tl-md">Id</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction Amount</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-tr-md">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ customer.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ customer.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ customer.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ customer.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ customer.address }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${{ customer.transactionAmount.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="editCustomer(customer)"
                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 transition duration-150 ease-in-out"
              >
                Edit
              </button>
              <button
                @click="deleteCustomer(customer.id)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
// CustomerList Component
// Displays the table of customers and emits events for edit/delete actions.
export default {
  name: 'CustomerList',
  props: ['customers'],
  methods: {
    // Emits 'edit-customer' event with the customer object
    editCustomer(customer) {
      this.$emit('edit-customer', customer);
    },
    // Emits 'delete-customer' event with the customer ID
    deleteCustomer(id) {
      // Using a simple browser confirm. In a full application,
      // this would be replaced by a custom modal dialog component.
      if (confirm('Are you sure you want to delete this customer?')) {
        this.$emit('delete-customer', id);
      }
    },
  }
};

</script>
