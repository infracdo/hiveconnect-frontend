<template>
  <button
    class="ml-10 pr-12 w-full border-l border-primary-gray-100"
    @click="navigate"
  >
    <div
      class="div px-5 py-2 flex flex-row hover:bg-drawer-tile-hover rounded ml-2 mr-4 items-center relative group/tile"
    >
      <div
        class="bg-primary-1000 drawer-bit rounded opacity-0 group-hover/tile:opacity-100 absolute left-0 transform transition-opacity duration-100"
      />
      <div
        class="group-hover/tile:translate-x-1 flex flex-row items-center transform transition-transform duration-100"
      >
        <p class="text-sm text-gray-iron-700 group-hover/tile:text-black">
          {{ title }}
        </p>
      </div>
    </div>
  </button>
</template>

<!-- TODO: convert this to setup script with typescript language-->
<script>
export default {
  name: "DrawerTileChild",
  props: {
    title: {
      type: String,
      required: true,
    },
    to: {
      type: String,
    },
  },
  methods: {
    navigate() {
      this.$router.push({ name: this.to });
    },
  },
};
</script>

<style scoped lang="css">
.drawer-bit {
  width: 3px;
  height: 16px;
}
</style>
