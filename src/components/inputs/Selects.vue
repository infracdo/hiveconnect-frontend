<template>
  <div class="p-0 border-none w-1/2">
    <span class="input-hint text-sm font-medium">
      {{ label }}: <span v-if="required" class="text-red-500">*</span>
    </span>

    <div class="relative">
      <div
        v-if="icon"
        class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"
      >
        <q-icon
          :name="icon"
          :class="['text-gray-300 dark:text-gray-400', textColor]"
          size="20px"
        />
      </div>

      <select
        ref="selectField"
        outlined
        v-model="selectedValue"
        @blur="validateSelect"
        :class="[
          'rounded-lg h-11 border block shadow-sm focus:outline-none focus:border-primary-600 focus:ring-primary-600 w-full text-base focus:ring-1 text-input-text-gray',
          { 'ps-10': icon },
          validationMessage ? 'border-error-300' : 'border-gray-300',
        ]"
        :required="required"
      >
        <option v-if="clearable" value="">None</option>
        <option
          v-for="option in options"
          :key="optionValue ? option[optionValue] : option.value"
          :value="optionValue ? option[optionValue] : option.value"
        >
          {{ optionLabel ? option[optionLabel] : option.value }}
        </option>
      </select>
    </div>

    <p v-if="validationMessage" class="text-error-500 text-xs mt-1">
      {{ validationMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Define props and its default values
const props = withDefaults(
  defineProps<{
    label: string;
    modelValue: string | number | null;
    required?: boolean;
    options: Array<Record<string, any>>;
    optionLabel?: string;
    optionValue?: string;
    clearable?: boolean;
    icon?: string;
    textColor?: string;
  }>(),
  {
    modelValue: "",
    required: false,
    clearable: false,
    textColor: "text-black",
  }
);

// Stores validation error message
const validationMessage = ref("");

// Define modelValue emit
const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

// Emit modelValue
const selectedValue = computed({
  get: () => props.modelValue ?? "",
  set: (value) => emit("update:modelValue", value),
});

// Define selectField as ref
const selectField = ref<HTMLInputElement | null>(null);

// Method for select validation
const validateSelect = () => {
  const selectObject = selectField.value;
  if (!selectObject) return;

  // Check if required and the value is empty or null
  if (props.required && !selectedValue.value) {
    validationMessage.value = `${props.label} is required`;
  } else {
    // Check for validity
    if (!selectObject.checkValidity()) {
      validationMessage.value = selectObject.validationMessage;
    } else {
      validationMessage.value = "";
    }
  }
};

onMounted(() => {
  console.log("Options received:", props.options);
});
</script>

<style>
.input-hint {
  display: block;
  margin-bottom: 2px;
  color: #757575;
  font-size: 0.875em;
}
</style>
