<template>
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Search & Filter Customers</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search by Name or Email</label>
          <input
            type="text"
            id="search"
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search customers..."
          />
        </div>
        <div class="flex space-x-4">
          <div>
            <label for="minAmount" class="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              id="minAmount"
              :value="minAmount"
              @input="$emit('update:minAmount', $event.target.value === '' ? null : parseFloat($event.target.value))"
              step="0.01"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Min"
            />
          </div>
          <div>
            <label for="maxAmount" class="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              id="maxAmount"
              :value="maxAmount"
              @input="$emit('update:maxAmount', $event.target.value === '' ? null : parseFloat($event.target.value))"
              step="0.01"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// SearchFilter Component
// Manages the search input and transaction amount filter inputs.
// Uses v-model compatible props and emits to allow parent to manage filter state.
export default {
  name:'SearchFilter',
  props: ['searchQuery', 'minAmount', 'maxAmount']
};
</script>