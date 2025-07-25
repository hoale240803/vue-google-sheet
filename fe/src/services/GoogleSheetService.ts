import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  async fetchSheetData(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add query parameters if provided
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.minAmount !== null && filters.minAmount !== undefined) {
        params.append('minAmount', filters.minAmount.toString());
      }
      if (filters.maxAmount !== null && filters.maxAmount !== undefined) {
        params.append('maxAmount', filters.maxAmount.toString());
      }
      
      const queryString = params.toString();
      const url = `${API_BASE_URL}/sheet${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  },
  async addCustomer(customer: { id: number, name: string; email: string; transactionAmount: number, phone: string, address: string }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/sheet`, customer);
      return response.data;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },
  async deleteCustomer(customerId: number) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/sheet/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },
  async updateCustomer(customerId: number, customer: { name: string; email: string; transactionAmount: number, phone: string, address: string }) {
    try {
      const response = await axios.put(`${API_BASE_URL}/sheet/${customerId}`, customer);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },
  // You can add more methods here for POST/PUT/DELETE if needed
};
