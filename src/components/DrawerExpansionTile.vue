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

    <!-- Accordion content with transition -->
    <div
      ref="accordionContent"
      :style="{ maxHeight: isOpen ? contentHeight + 'px' : '0px' }"
      class="transition-all duration-300 overflow-hidden"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "DrawerExpansionTile",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    to: {
      type: String,
    },
  },
  data() {
    return {
      isOpen: false, // Track the open/closed state of the accordion
      contentHeight: 0, // Height of the content for smooth transition
    };
  },
  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
      this.updateContentHeight();
    },
    updateContentHeight() {
      // Use the ref to get the content height
      this.$nextTick(() => {
        this.contentHeight = this.$refs.accordionContent.scrollHeight;
      });
    },
  },
  mounted() {
    this.updateContentHeight(); // Set initial height for transition
  },
};
</script>

<style scoped>
.drawer-bit {
  width: 3px;
  height: 16px;
}
</style>
