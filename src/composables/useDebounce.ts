import { ref, watch, onBeforeUnmount, type Ref } from 'vue';

export function useDebouncedRef<T>(source: Ref<T>, delayMs = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  watch(source, (value) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      debounced.value = value;
    }, delayMs);
  });

  onBeforeUnmount(() => clearTimeout(timeoutId));

  return debounced;
}