<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
  paginationNumbers: Array<number | '...'>;
}>();

const emit = defineEmits<{
  pageChange: [page: number];
}>();
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      :disabled="currentPage === 1"
      @click="emit('pageChange', currentPage - 1)"
    >
      Previous
    </button>

    <button
      v-for="page in paginationNumbers"
      :key="page"
      type="button"
      :class="{ active: page === currentPage }"
      :aria-current="page === currentPage ? 'page' : undefined"
      :disabled="page === '...'"
      @click="typeof page === 'number' && emit('pageChange', page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      :disabled="currentPage === totalPages"
      @click="emit('pageChange', currentPage + 1)"
    >
      Next
    </button>
  </nav>
</template>
