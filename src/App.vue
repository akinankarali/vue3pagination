<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { fetchPrograms, updateStatus } from './services/api';
import type { Program } from './types';

const searchQuery = ref('');
const programs = ref<Program[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const currentPage = ref(1);
const totalPrograms = ref(0);
const totalPages = ref(1);
const pageSize = 10;

const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const pageParam = Number(params.get('page'));

  return Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
};

const updatePageInUrl = (page: number) => {
  const url = new URL(window.location.href);

  url.searchParams.set('page', String(page));
  window.history.pushState({}, '', url);
};

const loadPrograms = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetchPrograms({
      page: currentPage.value,
      pageSize,
      search: searchQuery.value,
    });

    programs.value = response.programs;
    currentPage.value = response.page;
    totalPrograms.value = response.total;
    totalPages.value = response.totalPages;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return;
  }

  currentPage.value = page;
  updatePageInUrl(page);
  loadPrograms();
};

const handleStatusChange = async (program: Program, status: Program['status']) => {
  const previousStatus = program.status;
  program.status = status;

  try {
    await updateStatus(program.id, status);
  } catch (error) {
    program.status = previousStatus;
    errorMessage.value = error instanceof Error ? error.message : 'Status could not be updated.';
  }
};

const paginationNumbers = computed(() => {
  const pages: Array<number | '...'> = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }

    return pages;
  }

  pages.push(1);

  if (current > 4) {
    pages.push('...');
  }

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
});

let searchTimeoutId: number | undefined;

watch(searchQuery, () => {
  window.clearTimeout(searchTimeoutId);

  searchTimeoutId = window.setTimeout(() => {
    currentPage.value = 1;
    updatePageInUrl(1);
    loadPrograms();
  }, 300);
});

const handlePopState = () => {
  currentPage.value = getPageFromUrl();
  loadPrograms();
};

onMounted(() => {
  currentPage.value = getPageFromUrl();
  loadPrograms();
  window.addEventListener('popstate', handlePopState);
});

onBeforeUnmount(() => {
  window.clearTimeout(searchTimeoutId);
  window.removeEventListener('popstate', handlePopState);
});
</script>

<template>
  <main class="app-shell">
    <section class="page-header">
      <p class="eyebrow">Vue 3</p>
      <h1>Dashboard</h1>
      <p class="summary">
        {{ totalPrograms }} programs found. Showing {{ programs.length }} items on page
        {{ currentPage }} of {{ totalPages }}.
      </p>
    </section>

    <section class="toolbar" aria-label="Program filters">
      <label class="search-field">
        <span>Search programs</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by title or university"
        />
      </label>
    </section>

    <section class="program-list" aria-label="Programs awaiting review">
      <div v-if="loading" class="state-message">Loading programs...</div>
      <div v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</div>
      <div v-else-if="programs.length === 0" class="state-message">No programs found.</div>

      <ul v-else class="program-items">
        <li v-for="program in programs" :key="program.id" class="program-item">
          <div>
            <div class="program-title-row">
              <h2>{{ program.title }}</h2>
              <span class="status-badge" :class="program.status">{{ program.status }}</span>
            </div>
            <p class="university">{{ program.university }}</p>
            <p class="description">{{ program.description }}</p>
          </div>

          <div class="review-actions" aria-label="Review actions">
            <button
              type="button"
              class="approve"
              :disabled="program.status === 'approved'"
              @click="handleStatusChange(program, 'approved')"
            >
              Approve
            </button>
            <button
              type="button"
              class="reject"
              :disabled="program.status === 'rejected'"
              @click="handleStatusChange(program, 'rejected')"
            >
              Reject
            </button>
          </div>
        </li>
      </ul>
    </section>

    <nav class="pagination" aria-label="Pagination">
      <button
        type="button"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>

      <button
        v-for="page in paginationNumbers"
        :key="page"
        type="button"
        :class="{ active: page === currentPage }"
        @click="typeof page === 'number' && goToPage(page)"
        :disabled="page === '...'"
      >
        {{ page }}
      </button>

      <button
        type="button"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </main>
</template>
