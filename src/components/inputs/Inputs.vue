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
        <q-icon :name="icon" :class="'text-gray-400'" size="20px" />
      </div>

      <input
        ref="inputField"
        outlined
        v-model="inputValue"
        :placeholder="placeholder"
        :readonly="readonly"
        @focus="handleFocus"
        @blur="validateInput"
        :class="[
          'rounded-lg h-11 border block shadow-sm focus:outline-none focus:border-primary-600 focus:ring-primary-600 w-full text-base focus:ring-1 text-input-text-gray custom-date-picker',
          { 'ps-10': icon },
          { 'show-spinner': showSpinner },
          { 'cursor-default': readonly },
          validationMessage ? 'border-error-300' : 'border-gray-300',
        ]"
        :type="type"
        :step="step"
        :required="required"
      />

      <div
        v-if="type === 'date'"
        class="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none"
      >
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :style="{ stroke: validationMessage ? '#F04438' : '#434343`' }"
        >
          <path
            d="M9.66667 1.33337V4.00004M4.33333 1.33337V4.00004M1 6.66671H13M2.33333 2.66671H11.6667C12.403 2.66671 13 3.26366 13 4.00004V13.3334C13 14.0698 12.403 14.6667 11.6667 14.6667H2.33333C1.59695 14.6667 1 14.0698 1 13.3334V4.00004C1 3.26366 1.59695 2.66671 2.33333 2.66671Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div
        v-if="validationMessage && type !== 'date'"
        class="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none"
      >
        <q-icon
          :name="'eva-alert-circle-outline'"
          :class="'text-error-500'"
          size="18px"
        />
      </div>
    </div>

    <p v-if="validationMessage" class="text-error-500 text-xs mt-1">
      {{ validationMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Define props and its default value (if any)
const props = withDefaults(
  defineProps<{
    label: string;
    type?: string;
    icon?: string;
    modelValue: string | number;
    readonly?: boolean;
    showSpinner?: boolean;
    step?: string; // Allow decimal values
    required?: boolean;
    placeholder?: string;
  }>(),
  {
    type: "text",
    modelValue: "",
    readonly: false,
    showSpinner: false,
    required: false,
  }
);

// Stores validation error message
const validationMessage = ref("");

// Define modelValue emit
const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Method to prevent focus if the input is readonly
const handleFocus = (event: FocusEvent) => {
  if (props.readonly) {
    (event.target as HTMLInputElement).blur();
  }
};

// Define inputField as ref
const inputField = ref<HTMLInputElement | null>(null);

// Method to validate input
const validateInput = () => {
  const inputObject = inputField.value;
  if (!inputObject) return;

  if (props.required && !inputValue.value) {
    validationMessage.value = `${props.label} is required`;
  } else if (!inputObject.checkValidity()) {
    validationMessage.value = inputObject.validationMessage;
  } else {
    validationMessage.value = "";
  }
};
</script>

<style>
.input-hint {
  display: block;
  margin-bottom: 2px;
  color: #757575;
  font-size: 0.875em;
}
/* Hide spinners on number input for all browsers */
.input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield; /* For Firefox */
  appearance: textfield; /* For compatibility */
}
/* Show spinner for specific number input */
input[type="number"].show-spinner::-webkit-outer-spin-button,
input[type="number"].show-spinner::-webkit-inner-spin-button {
  -webkit-appearance: auto; /* Enable the default appearance */
  margin: 0;
}
input[type="number"].show-spinner {
  -moz-appearance: auto; /* For Firefox, rever to default */
  appearance: auto;
}
.custom-date-picker::-webkit-calendar-picker-indicator {
  opacity: 0;
  display: block;
  position: absolute;
  right: 10px;
  width: 20px;
  height: 100%;
  cursor: pointer;
}
</style>
