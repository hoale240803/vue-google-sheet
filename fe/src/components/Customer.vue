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
      />
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import GoogleSheetService from '../services/GoogleSheetService.ts';
import CustomerForm from './CustomerForm.vue';
import CustomerList from './CustomerList.vue';
import MessageBox from './MessageBox.vue';
import SearchFilter from './SearchFilter.vue';

// Reactive state
const customers = ref([]);
const searchQuery = ref('');
const minAmount = ref(null);
const maxAmount = ref(null);
const customerToEdit = ref(null);
const isEditing = ref(false);
const message = ref('');
let messageTimeout = null;

// Computed property for filtered customers
const filteredCustomers = computed(() => {

  console.log("customers at filter", customers.value);
  
  return customers.value.filter((customer) => {
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

onMounted(async () => {
  try {
    const data = await GoogleSheetService.fetchSheetData();
    // Optionally, parse transactionAmount to number if needed
    console.log("data", data);
    
    
    customers.value = data.map((customer, idx) => ({
      ...customer,
      id: customer.id || idx + 1,
      transactionAmount: Number(customer.transactionAmount) || 0,
    }));

    console.log(customers.value);
    
  } catch (error) {
    showMessage('Failed to fetch customers from Google Sheet.');
  }
});

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
    customers.value = customers.value.map((cust) =>
      cust.id === customerData.id ? { ...customerData } : cust
    );
    showMessage('Customer updated successfully!');
  } else {
    try {
      // Find max id in current customers
      const maxId = customers.value.length > 0 ? Math.max(...customers.value.map(c => Number(c.id) || 0)) : 0;
      const customerId = maxId + 1;
      // Send to backend to add to Google Sheet
      await GoogleSheetService.addCustomer({
        id: customerId, // Add customerId field
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        transactionAmount: customerData.transactionAmount,
        address: customerData.address || 'temp'
      });
      showMessage('Customer added successfully!');
      // Optionally, refresh the list from backend
      const data = await GoogleSheetService.fetchSheetData();
      customers.value = data.map((customer, idx) => ({
        ...customer,
        id: Number(customer.id),
        transactionAmount: Number(customer.transactionAmount) || 0,
      }));
    } catch (error) {
      showMessage('Failed to add customer to Google Sheet.');
    } 
  }
  isEditing.value = false;
  customerToEdit.value = null;
};

const handleEditCustomer = (customer) => {
  customerToEdit.value = { ...customer };
  isEditing.value = true;
};

const handleDeleteCustomer = (id) => {
  customers.value = customers.value.filter((customer) => customer.id !== id);
  showMessage('Customer deleted successfully!');
  if (customerToEdit.value && customerToEdit.value.id === id) {
    handleCancelEdit();
  }
};

const handleCancelEdit = () => {
  isEditing.value = false;
  customerToEdit.value = null;
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