import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  async fetchSheetData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/sheet`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  },
  async fetchSheetDataPaginated(page: number = 1, limit: number = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/sheet?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated sheet data:', error);
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
