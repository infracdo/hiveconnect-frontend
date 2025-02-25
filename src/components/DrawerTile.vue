<template>
  <button class="w-full" @click="navigate">
    <div
      class="div px-4 py-2 flex flex-row hover:bg-drawer-tile-hover rounded mx-4 items-center relative group/tile"
    >
      <div
        class="bg-primary-1000 drawer-bit rounded opacity-0 group-hover/tile:opacity-100 absolute left-0 transform transition-opacity duration-100"
      />
      <div
        class="group-hover/tile:translate-x-1 flex flex-row items-center transform transition-transform duration-100"
      >
        <i
          :class="
            'demo-icon text-gray-iron-700 mr-4 group-hover/tile:text-black ' +
            icon
          "
        />
        <!-- <q-icon class="text-black" size="sm"> -->
        <!--   <img svg-inline :src="'../assets/' + icon + '.svg'" /> -->
        <!-- </q-icon> -->
        <p class="text-sm text-gray-iron-700 group-hover/tile:text-black">
          {{ title }}
        </p>
      </div>
    </div>
  </button>
</template>

<!-- TODO: convert this to setup script with typescript language -->
<script>
export default {
  name: "DrawerTile",
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
      isActive: false,
    };
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
