<template>
  <div class="flex items-center">
    <q-icon
      v-if="status === false"
      name="fa-solid fa-circle-xmark"
      class="text-error-700"
      size="12px"
    />

    <q-icon
      v-else
      name="fa-solid fa-circle-check"
      class="text-success-700"
      size="12px"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  status: boolean;
}>();
</script>
