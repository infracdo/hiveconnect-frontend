<template>
  <q-btn-dropdown
    unelevated
    class="bg-gray-iron-100 rounded-lg text-base"
    no-caps
    :label="computedLabel"
    ref="dropdownRef"
  >
    <q-list v-if="columnOptions.length">
      <q-item
        @click="emitSelection(option)"
        v-for="(option, index) in columnOptions"
        :key="index"
        clickable
        v-close-popup
      >
        <q-item-section v-if="showCheckbox">
          <q-checkbox
            v-model="selectedOptions"
            :val="option.value"
            size="sm"
            :label="option.label"
            :disable="!showCheckbox"
          />
        </q-item-section>

        <q-item-section v-else>
          {{ option.label }}
        </q-item-section>
      </q-item>
    </q-list>
    <!-- <slot v-else /> -->
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  label: string | string[];
  columnOptions: { label: string; value: string }[];
  showCheckbox?: boolean;
  selectedOptions?: string[];
}>();

const emit = defineEmits(["select"]);
const selectedOptions = ref<string[]>([...(props.selectedOptions || [])]);

const computedLabel = computed(() =>
  Array.isArray(props.label) ? props.label.join(", ") : props.label
);

const emitSelection = (option: { label: string; value: string }) => {
  if (props.showCheckbox) {
    emit("select", selectedOptions.value);
  } else {
    emit("select", option);
  }
};

watch(selectedOptions, (newValue) => {
  if (props.showCheckbox) {
    emit("select", newValue);
  }
});

watch(
  () => props.selectedOptions,
  (newValue) => {
    if (newValue) {
      selectedOptions.value = [...newValue];
    }
  },
  { deep: true }
);
</script>
