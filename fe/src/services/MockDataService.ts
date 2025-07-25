// Mock data service for testing pagination
export default {
  generateMockCustomers(count: number = 50) {
    const customers = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma', 'William', 'Olivia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'company.com', 'business.org'];

    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
      
      customers.push({
        id: i,
        name: `${firstName} ${lastName}`,
        email: email,
        phone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${lastNames[Math.floor(Math.random() * lastNames.length)]} St`,
        transactionAmount: Math.floor(Math.random() * 10000) + 100
      });
    }
    
    return customers;
  },

  async fetchSheetDataPaginated(page: number = 1, limit: number = 10) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allCustomers = this.generateMockCustomers(50);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allCustomers.slice(startIndex, endIndex);
    
    const totalItems = allCustomers.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  },

  async fetchSheetData() {
    return this.generateMockCustomers(50);
  },

  async addCustomer(customer: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'Customer added successfully' };
  },

  async updateCustomer(id: number, customer: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'Customer updated successfully' };
  },

  async deleteCustomer(id: number) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'Customer deleted successfully' };
  }
};