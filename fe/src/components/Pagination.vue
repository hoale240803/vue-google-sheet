<template>
  <div class="pagination-container flex items-center justify-center space-x-2 mt-6">
    <!-- Previous Button -->
    <button
      @click="goToPreviousPage"
      :disabled="!hasPreviousPage"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
    >
      Previous
    </button>

    <!-- Page Numbers -->
    <div class="flex space-x-1">
      <!-- First page -->
      <button
        v-if="showFirstPage"
        @click="goToPage(1)"
        class="px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out"
        :class="currentPage === 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
      >
        1
      </button>

      <!-- First ellipsis -->
      <span v-if="showFirstEllipsis" class="px-3 py-2 text-sm text-gray-500">
        ...
      </span>

      <!-- Middle pages -->
      <button
        v-for="page in middlePages"
        :key="page"
        @click="goToPage(page)"
        class="px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out"
        :class="currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
      >
        {{ page }}
      </button>

      <!-- Second ellipsis -->
      <span v-if="showSecondEllipsis" class="px-3 py-2 text-sm text-gray-500">
        ...
      </span>

      <!-- Last page -->
      <button
        v-if="showLastPage"
        @click="goToPage(totalPages)"
        class="px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out"
        :class="currentPage === totalPages ? 'bg-indigo-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
      >
        {{ totalPages }}
      </button>
    </div>

    <!-- Next Button -->
    <button
      @click="goToNextPage"
      :disabled="!hasNextPage"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
    >
      Next
    </button>

    <!-- Items per page selector -->
    <div class="flex items-center ml-4">
      <label for="itemsPerPage" class="text-sm text-gray-700 mr-2">Items per page:</label>
      <select
        id="itemsPerPage"
        :value="itemsPerPage"
        @change="changeItemsPerPage"
        class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>

  <!-- Pagination Info -->
  <div class="text-center mt-4 text-sm text-gray-600">
    Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} results
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  emits: ['page-change', 'items-per-page-change'],
  props: {
    currentPage: {
      type: Number,
      required: true,
      default: 1
    },
    totalPages: {
      type: Number,
      required: true,
      default: 1
    },
    totalItems: {
      type: Number,
      required: true,
      default: 0
    },
    itemsPerPage: {
      type: Number,
      required: true,
      default: 10
    },
    hasNextPage: {
      type: Boolean,
      default: false
    },
    hasPreviousPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // Calculate which pages to show in the middle
    middlePages() {
      const delta = 2; // Number of pages to show on each side of current page
      const range = [];
      const rangeWithDots = [];

      // Calculate start and end of the range
      const start = Math.max(2, this.currentPage - delta);
      const end = Math.min(this.totalPages - 1, this.currentPage + delta);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      return range;
    },
    showFirstPage() {
      return this.totalPages > 1;
    },
    showLastPage() {
      return this.totalPages > 1 && this.totalPages !== this.currentPage && !this.middlePages.includes(this.totalPages);
    },
    showFirstEllipsis() {
      return this.currentPage > 4;
    },
    showSecondEllipsis() {
      return this.currentPage < this.totalPages - 3;
    },
    startItem() {
      return Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.totalItems);
    },
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    }
  },
  methods: {
    goToPage(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    },
    goToNextPage() {
      if (this.hasNextPage) {
        this.goToPage(this.currentPage + 1);
      }
    },
    goToPreviousPage() {
      if (this.hasPreviousPage) {
        this.goToPage(this.currentPage - 1);
      }
    },
    changeItemsPerPage(event) {
      const newItemsPerPage = parseInt(event.target.value);
      this.$emit('items-per-page-change', newItemsPerPage);
    }
  }
};
</script>

<style scoped>
.pagination-container {
  user-select: none;
}
</style>