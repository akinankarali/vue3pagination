import { ref, watch, type Ref } from 'vue';
import { fetchPrograms, updateStatus } from '@/services/api';
import type { Program } from '@/types';

interface UseProgramsOptions {
  currentPage: Ref<number>;
  pageSize: number;
  searchQuery: Ref<string>;
}

export function usePrograms({ currentPage, pageSize, searchQuery }: UseProgramsOptions) {
  const programs = ref<Program[]>([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref('');

  async function load() {
    loading.value = true;
    error.value = '';

    try {
      const response = await fetchPrograms({
        page: currentPage.value,
        pageSize,
        search: searchQuery.value,
      });

      programs.value = response.data;
      currentPage.value = response.page;
      totalItems.value = response.total;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong.';
    } finally {
      loading.value = false;
    }
  }

  async function changeStatus(program: Program, status: Program['status']) {
    const previousStatus = program.status;
    program.status = status;

    try {
      await updateStatus(program.id, status);
    } catch (e) {
      program.status = previousStatus;
      error.value = e instanceof Error ? e.message : 'Status could not be updated.';
    }
  }

  watch(currentPage, () => load());

  watch(searchQuery, () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    } else {
      load();
    }
  });

  load();

  return { programs, totalItems, loading, error, load, changeStatus };
}
