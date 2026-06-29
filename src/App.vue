<script setup lang="ts">
import { ref } from 'vue';
import { useDebouncedRef } from '@/composables/useDebounce';
import { usePagination } from '@/composables/usePagination';
import { usePrograms } from '@/composables/usePrograms';
import { useUrlSync } from '@/composables/useUrlSync';
import SearchInput from '@/components/SearchInput.vue';
import ProgramCard from '@/components/ProgramCard.vue';
import PaginationBar from '@/components/PaginationBar.vue';

const PAGE_SIZE = 10;

const rawSearch = ref('');
const searchQuery = useDebouncedRef(rawSearch, 300);

const currentPage = ref(1);

useUrlSync(currentPage);

const { programs, totalItems, loading, error, changeStatus } = usePrograms({
  currentPage,
  pageSize: PAGE_SIZE,
  searchQuery,
});

const { totalPages, paginationNumbers, goToPage } = usePagination({
  currentPage,
  totalItems,
  pageSize: PAGE_SIZE,
});
</script>

<template>
  <main class="app-shell">
    <section class="page-header">
      <p class="eyebrow">Vue 3</p>
      <h1>Dashboard</h1>
      <p class="summary">
        {{ totalItems }} programs found. Showing {{ programs.length }} items on page
        {{ currentPage }} of {{ totalPages }}.
      </p>
    </section>

    <SearchInput v-model="rawSearch" />

    <section class="program-list" aria-label="Programs awaiting review">
      <div v-if="loading" class="state-message" role="status">Loading programs...</div>
      <div v-else-if="error" class="state-message error" role="alert">{{ error }}</div>
      <div v-else-if="programs.length === 0" class="state-message">No programs found.</div>

      <ul v-else class="program-items">
        <ProgramCard
          v-for="program in programs"
          :key="program.id"
          :program="program"
          @status-change="changeStatus"
        />
      </ul>
    </section>

    <PaginationBar
      :current-page="currentPage"
      :total-pages="totalPages"
      :pagination-numbers="paginationNumbers"
      @page-change="goToPage"
    />
  </main>
</template>
