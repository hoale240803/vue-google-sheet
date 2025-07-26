<template>
  <div class="customer-bg min-h-screen flex flex-col items-center justify-center py-12 px-4">
    <div class="customer-card w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
      <!-- Message Box Component -->
      <MessageBox :message="message" />

      <!-- Page Title -->
      <h1 class="text-4xl font-bold text-gray-800 mb-8 mt-2 text-center">Customer Management (Vue.js)</h1>

      <!-- Customer Form Component -->
      <CustomerForm
        :customer-to-edit="customerToEdit"
        :is-editing="isEditing"
        @save-customer="handleSaveCustomer"
        @cancel-edit="handleCancelEdit"
        @show-message="showMessage"
      />

      <!-- Search and Filter Component -->
      <SearchFilter
        v-model:search-query="searchQuery"
        v-model:min-amount="minAmount"
        v-model:max-amount="maxAmount"
      />

      <!-- Customer List Component -->
      <CustomerList
        :customers="filteredCustomers"
        @edit-customer="handleEditCustomer"
        @delete-customer="handleDeleteCustomer"
        @view-details="handleViewDetails"
      />

      <!-- Customer Detail Modal -->
      <CustomerDetail
        :customer="customerToView"
        @close-details="handleCloseDetails"
        @edit-customer="handleEditFromDetails"
      />

      <!-- Pagination Component -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :has-next-page="hasNextPage"
        :has-previous-page="hasPreviousPage"
        @page-change="handlePageChange"
        @items-per-page-change="handleItemsPerPageChange"
      />
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import GoogleSheetService from '../services/GoogleSheetService.ts';
import CustomerForm from './CustomerForm.vue';
import CustomerList from './CustomerList.vue';
import CustomerDetail from './CustomerDetail.vue';
import MessageBox from './MessageBox.vue';
import SearchFilter from './SearchFilter.vue';
import Pagination from './Pagination.vue';

// Reactive state
const customers = ref([]);
const searchQuery = ref('');
const minAmount = ref(null);
const maxAmount = ref(null);
const customerToEdit = ref(null);
const customerToView = ref(null);
const isEditing = ref(false);
const message = ref('');
let messageTimeout = null;

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const hasNextPage = ref(false);
const hasPreviousPage = ref(false);
const paginatedCustomers = ref([]);

// Computed property for filtered customers (applied to current page data)
const filteredCustomers = computed(() => {
  console.log("customers at filter", paginatedCustomers.value);
  
  return paginatedCustomers.value.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.value.toLowerCase());

    const customerAmount = customer.transactionAmount;
    const min = parseFloat(minAmount.value);
    const max = parseFloat(maxAmount.value);

    const matchesAmount =
      (isNaN(min) || customerAmount >= min) && (isNaN(max) || customerAmount <= max);

    return matchesSearch && matchesAmount;
  });
});

// Load paginated data
const loadPaginatedData = async (page = 1, limit = 10) => {
  try {
    const data = await GoogleSheetService.fetchSheetDataPaginated(page, limit);
    console.log("paginated data", data);
    
    if (data.data) {
      // New paginated response format
      paginatedCustomers.value = data.data.map((customer, idx) => ({
        ...customer,
        id: customer.id || idx + 1,
        transactionAmount: Number(customer.transactionAmount) || 0,
      }));
      
      // Update pagination info
      const pagination = data.pagination;
      currentPage.value = pagination.currentPage;
      totalPages.value = pagination.totalPages;
      totalItems.value = pagination.totalItems;
      hasNextPage.value = pagination.hasNextPage;
      hasPreviousPage.value = pagination.hasPreviousPage;
      itemsPerPage.value = pagination.itemsPerPage;
    } else {
      // Fallback to old format if no pagination data
      paginatedCustomers.value = data.map((customer, idx) => ({
        ...customer,
        id: customer.id || idx + 1,
        transactionAmount: Number(customer.transactionAmount) || 0,
      }));
    }
  } catch (error) {
    showMessage('Failed to fetch customers from Google Sheet.');
    console.error('Error loading paginated data:', error);
  }
};

onMounted(async () => {
  await loadPaginatedData(1, itemsPerPage.value);
});

// Pagination event handlers
const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadPaginatedData(page, itemsPerPage.value);
};

const handleItemsPerPageChange = async (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage;
  currentPage.value = 1; // Reset to first page
  await loadPaginatedData(1, newItemsPerPage);
};

// For debugging: try to add a hardcoded valid customer
const addHardcodedCustomer = async () => {
  try {
    const hardcodedCustomer = {
      id: 999,
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '1234567890',
      address: '123 Test St',
      transactionAmount: 100
    };
    await GoogleSheetService.addCustomer(hardcodedCustomer);
    showMessage('Hardcoded customer added!');
    // Optionally refresh
    const data = await GoogleSheetService.fetchSheetData();
    customers.value = data.map((customer, idx) => ({
      ...customer,
      id: customer.id || idx + 1,
      transactionAmount: Number(customer.transactionAmount) || 0,
    }));
  } catch (error) {
    showMessage('Failed to add hardcoded customer.');
    console.error(error);
  }
};

// Uncomment to test on mount
// onMounted(addHardcodedCustomer);

// Methods
const showMessage = (text) => {
  message.value = text;
  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }
  messageTimeout = setTimeout(() => {
    message.value = '';
  }, 3000);
};

const handleSaveCustomer = async (customerData) => {
  if (isEditing.value) {
    try {
      // Call the API to update the customer
      await GoogleSheetService.updateCustomer(customerData.id, {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || 'temp',
        transactionAmount: customerData.transactionAmount
      });
      
      showMessage('Customer updated successfully!');
      
      // Refresh the current page
      await loadPaginatedData(currentPage.value, itemsPerPage.value);
    } catch (error) {
      showMessage('Failed to update customer.');
      console.error('Update error:', error);
    }
  } else {
    try {
      // Find max id across all customers (for proper ID generation)
      const allCustomersResponse = await GoogleSheetService.fetchSheetData();
      const allCustomers = Array.isArray(allCustomersResponse) ? allCustomersResponse : allCustomersResponse.data || [];
      const maxId = allCustomers.length > 0 ? Math.max(...allCustomers.map(c => Number(c.id) || 0)) : 0;
      const customerId = maxId + 1;
      
      // Send to backend to add customer
      await GoogleSheetService.addCustomer({
        id: customerId,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        transactionAmount: customerData.transactionAmount,
        address: customerData.address || 'temp'
      });
      showMessage('Customer added successfully!');
      
      // Refresh the current page
      await loadPaginatedData(currentPage.value, itemsPerPage.value);
    } catch (error) {
      showMessage('Failed to add customer.');
      console.error('Add error:', error);
    } 
  }
  isEditing.value = false;
  customerToEdit.value = null;
};

const handleEditCustomer = (customer) => {
  customerToEdit.value = { ...customer };
  isEditing.value = true;
};

const handleDeleteCustomer = async (id) => {
  try {
    // Call the API to delete customer
    await GoogleSheetService.deleteCustomer(id);
    showMessage('Customer deleted successfully!');
    
    // Refresh the current page
    await loadPaginatedData(currentPage.value, itemsPerPage.value);
    
    if (customerToEdit.value && customerToEdit.value.id === id) {
      handleCancelEdit();
    }
  } catch (error) {
    showMessage('Failed to delete customer.');
    console.error(error);
  }
};

const handleCancelEdit = () => {
  isEditing.value = false;
  customerToEdit.value = null;
};

const handleViewDetails = (customer) => {
  customerToView.value = { ...customer };
};

const handleCloseDetails = () => {
  customerToView.value = null;
};

const handleEditFromDetails = (customer) => {
  customerToEdit.value = { ...customer };
  isEditing.value = true;
  customerToView.value = null;
};
</script>

<style scoped>
.customer-bg {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
}

.customer-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 900px;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;

  align-items: center;
}

h1 {
  color: #3730a3;
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  text-align: center;
}

@media (max-width: 600px) {
  .customer-card {
    padding: 1rem 0.5rem;
    border-radius: 1rem;
  }
}
</style>