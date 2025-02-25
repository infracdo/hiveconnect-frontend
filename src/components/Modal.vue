<template>
  <q-dialog
    v-model="localIsVisible"
    persistent
    class="rounded-lg"
    position="right"
  >
    <q-card
      class="px-6 pb-6 dialog-content"
      :style="{
        width: width,
        maxWidth: '100%',
        height: height,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <q-form
        @submit="handleSubmit"
        style="flex: 1; display: flex; flex-direction: column"
        novalidate
      >
        <div
          style="z-index: 2"
          class="text-lg font-semibold row items-center no-wrap bg-white h-[52px] pt-4 sticky"
        >
          <span> {{ title }} </span>
        </div>

        <q-card-section class="mt-4 p-0" style="z-index: 1">
          <slot></slot>
        </q-card-section>

        <div
          class="mt-4"
          style="display: flex; justify-content: flex-end; margin-top: auto"
        >
          <Buttons
            label="Cancel"
            v-close-popup
            color="bg-transparent"
            textColor="text-primary-600"
            button="modal"
          />

          <Buttons
            class="ml-2"
            color="bg-primary-600"
            textColor="text-white"
            :label="submitButton"
            type="submit"
            button="modal"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Buttons from "./inputs/Buttons.vue";

// Modals props with its default values
const props = withDefaults(
  defineProps<{
    isVisible: boolean;
    title: string;
    subAction?: string;
    actionHandler: () => void;
    width?: string;
    height?: string;
    submitButton: string;
  }>(),
  {
    subAction: "add",
    width: "960px",
  }
);

// Tracks state of modal if visible or not
const localIsVisible = ref(props.isVisible);
// Define a computed property to change the button label based on the state of showSaveButton prop
// const buttonLabel = computed(() =>
//   props.showSaveButton ? "Save" : "Activate"
// );

const emit = defineEmits<{
  (event: "update:isVisible", value: boolean): void;
}>();

watch(
  () => props.isVisible,
  (newVal) => {
    if (props.isVisible) {
      localIsVisible.value = newVal;
    }
  }
);

watch(localIsVisible, (newVal) => {
  emit("update:isVisible", newVal);
});

// Method for form submission
const handleSubmit = (event: Event) => {
  const form = event.target as HTMLFormElement;

  if (form.checkValidity()) {
    props.actionHandler();
  } else {
    Array.from(form.elements).forEach((input) =>
      (input as HTMLElement).dispatchEvent(new Event("blur"))
    );
  }
};
</script>

<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
.q-dialog .q-card {
  border-radius: 8px;
}
.dialog-content {
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.dialog-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
</style>
