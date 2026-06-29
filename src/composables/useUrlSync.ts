import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';


export function useUrlSync(currentPage: Ref<number>) {
  function getPageFromUrl(): number {
    const pageParam = Number(new URLSearchParams(window.location.search).get('page'));
    return Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  }

  function syncToUrl(page: number) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    window.history.pushState({}, '', url);
  }

  currentPage.value = getPageFromUrl();

  watch(currentPage, syncToUrl);

  function handlePopState() {
    currentPage.value = getPageFromUrl();
  }

  onMounted(() => window.addEventListener('popstate', handlePopState));
  onBeforeUnmount(() => window.removeEventListener('popstate', handlePopState));
}
