<script setup lang="ts">
const searchQuery = defineModel<string>({ required: true });
</script>

<template>
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
</template>
