<template>
  <q-card flat class="my-2 rounded-lg border border-gray-iron-200 py-2">
    <!-- Card title -->
    <q-card-section>
      <p class="text-xs text-gray-iron-500 uppercase font-semibold">
        {{ header }}
      </p>
    </q-card-section>

    <q-separator inset />

    <!-- Use v-for for dynamic display of provisioned details -->
    <q-card-section>
      <div class="flex-row grid grid-cols-7">
        <div v-for="(item, index) in details" :key="index">
          <p class="text-xs text-gray-iron-500 uppercase mb-2">
            {{ item.label }}
          </p>
          <p class="text-sm text-gray-iron-900">{{ item.value }}</p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  header: string;
  details: { label: string; value: string | number }[];
}>();
</script>
