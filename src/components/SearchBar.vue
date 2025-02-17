<template>
  <div class="relative flex flex-row items-center w-80">
    <input
      type="text"
      name="search"
      class="block bg-gray-iron-50 rounded-xl border-1 border-gray-iron-100"
      id="search-id"
      :placeholder="hint"
      :value="modelValue"
      @input="updateValue"
      @keyup.enter="searchFunction"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hint: string;
  searchFunction: (event: KeyboardEvent) => void;
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emit("update:modelValue", target.value);
  }
};
</script>
