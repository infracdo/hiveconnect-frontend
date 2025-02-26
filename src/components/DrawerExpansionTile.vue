<template>
  <div>
    <button @click="toggleAccordion" class="w-full">
      <div
        class="px-4 py-2 flex flex-row hover:bg-drawer-tile-hover rounded mx-4 items-center relative group/tile"
      >
        <div
          class="bg-primary-600 drawer-bit rounded opacity-0 group-hover/tile:opacity-100 absolute left-0 transform transition-opacity duration-100"
        />
        <div
          class="group-hover/tile:translate-x-1 w-full flex flex-row items-center justify-between transform transition-transform duration-100"
        >
          <div class="flex flex-row">
            <i
              :class="
                'demo-icon text-gray-iron-700 mr-4 group-hover/tile:text-black ' +
                icon
              "
            />
            <p class="text-sm text-gray-iron-700 group-hover/tile:text-black">
              {{ title }}
            </p>
          </div>
          <q-icon
            :name="isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            size="sm"
            class="text-gray-iron-500 group-hover/tile:text-black transition-transform duration-300"
            :class="{ 'rotate-180': isOpen }"
          />
        </div>
      </div>
    </button>

    <!-- Accordion content -->
    <div
      ref="accordionContent"
      :style="{ maxHeight: isOpen ? contentHeight + 'px' : '0px' }"
      class="transition-all duration-300 overflow-hidden"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";

defineProps<{
  title: string;
  icon?: string;
  to?: string;
}>();

const isOpen = ref(false);
const contentHeight = ref(0);
const accordionContent = ref<HTMLElement | null>(null);

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
  updateContentHeight();
};

const updateContentHeight = () => {
  nextTick(() => {
    if (accordionContent.value) {
      contentHeight.value = accordionContent.value.scrollHeight;
    }
  });
};

onMounted(updateContentHeight);
</script>

<style scoped>
.drawer-bit {
  width: 3px;
  height: 16px;
}
</style>
