<template>
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-x-auto">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Customer List</h2>
      <p v-if="customers.length === 0" class="text-center text-gray-500">No customers found matching your criteria.</p>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-md">Id</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Amount</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-md">
              Actions
              <button
                @click="addCustomer"
                class="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Add Customer
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="customer in customers" :key="customer.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.address }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${{ customer.transactionAmount.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="editCustomer(customer)"
                class="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 ease-in-out"
              >
                Edit
              </button>
              <button
                @click="deleteCustomer(customer.id)"
                class="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
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
    // Emits 'add-customer' event to show add customer popup
    addCustomer() {
      this.$emit('add-customer');
    },
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
