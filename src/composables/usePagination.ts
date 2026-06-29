import { computed, type Ref } from 'vue';

interface UsePaginationOptions {
  currentPage: Ref<number>;
  totalItems: Ref<number>;
  pageSize?: number;
}

export function usePagination({ currentPage, totalItems, pageSize = 10 }: UsePaginationOptions) {
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)));

  const paginationNumbers = computed(() => {
    const pages: Array<number | '...'> = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current > 4) pages.push('...');

    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push('...');
    pages.push(total);

    return pages;
  });

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return;
    currentPage.value = page;
  }

  return { totalPages, paginationNumbers, goToPage };
}
