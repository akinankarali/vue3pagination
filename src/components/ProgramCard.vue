<script setup lang="ts">
import type { Program } from '@/types';

const props = defineProps<{
  program: Program;
}>();

const emit = defineEmits<{
  statusChange: [program: Program, status: Program['status']];
}>();
</script>

<template>
  <li class="program-item">
    <div>
      <div class="program-title-row">
        <h2>{{ props.program.title }}</h2>
        <span class="status-badge" :class="props.program.status">
          {{ props.program.status }}
        </span>
      </div>
      <p class="university">{{ props.program.university }}</p>
      <p class="description">{{ props.program.description }}</p>
    </div>

    <div class="review-actions" aria-label="Review actions">
      <button
        type="button"
        class="approve"
        :disabled="props.program.status === 'approved'"
        @click="emit('statusChange', props.program, 'approved')"
      >
        Approve
      </button>
      <button
        type="button"
        class="reject"
        :disabled="props.program.status === 'rejected'"
        @click="emit('statusChange', props.program, 'rejected')"
      >
        Reject
      </button>
    </div>
  </li>
</template>
