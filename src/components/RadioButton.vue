<template>
  <div class="p-0 border-none w-1/2">
    <span class="input-hint text-sm font-medium">
      Network Type: <span class="text-red-500">*</span>
    </span>

    <div class="relative">
      <div
        @blur="validateRadioButton"
        :required="required"
        :class="[
          'rounded-lg h-11 border block shadow-sm focus:outline-none focus:border-primary-600 focus:ring-primary-600 w-full',
          { 'ps-10': icon },
          validationMessage ? 'border-error-300' : 'border-gray-300',
        ]"
        tabindex="0"
      >
        <div
          class="flex flex-row q-gutter-xs justify-center items-center h-full"
        >
          <q-radio
            v-for="option in options"
            :key="option.value"
            v-model.trim="radioButtonValue"
            :val="option.value"
            :label="option.label"
            dense
          />
        </div>
      </div>
    </div>

    <!-- Validation message -->
    <p v-if="validationMessage" class="text-error-500 text-xs mt-1">
      {{ validationMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  label: string;
  icon?: string;
  modelValue: string | number;
  options: { value: string | number; label: string }[];
  readonly?: string;
  showSpinner?: boolean;
  required?: boolean;
}>();

const validationMessage = ref("");

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

const radioButtonValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const validateRadioButton = () => {
  if (props.required && !radioButtonValue.value) {
    validationMessage.value = `${props.label} is required`;
  } else {
    if (
      radioButtonValue.value !== "Enterprise" &&
      radioButtonValue.value !== "Residential"
    ) {
      validationMessage.value = "Invalid network type selected`";
    } else {
      validationMessage.value = "";
    }
  }
};
</script>
