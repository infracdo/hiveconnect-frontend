<template>
  <router-link :to="link" class="w-full no-underline">
    <div
      class="px-4 py-2 flex flex-row hover:bg-drawer-tile-hover rounded mx-4 items-center relative group/tile"
    >
      <div
        class="bg-primary-1000 drawer-bit rounded opacity-0 group-hover/tile:opacity-100 absolute left-0 transform transition-opacity duration-100"
      />
      <div
        class="group-hover/tile:translate-x-1 flex flex-row items-center transform transition-transform duration-100"
      >
        <q-icon
          v-if="icon"
          :name="icon"
          class="text-gray-iron-700 mr-4 group-hover/tile:text-black"
        />
        <p class="text-sm text-gray-iron-700 group-hover/tile:text-black">
          {{ title }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  link?: string;
  icon?: string;
}
withDefaults(defineProps<EssentialLinkProps>(), {
  link: "#",
  icon: "",
});
</script>

<style scoped>
.drawer-bit {
  width: 3px;
  height: 16px;
}
</style>
