<template>
  <q-item clickable exact :to="link" v-ripple>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <!-- v-if="leftDrawerOpen" -->
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  // leftOpenDrawer: boolean;
}
withDefaults(defineProps<EssentialLinkProps>(), {
  caption: "",
  link: "#",
  icon: "",
  // leftDrawerOpen: false,
});
</script>
<style scoped>
.q-item-section {
  transition: opacity 0.3s;
}

.q-item-section[avatar] {
  width: 56px;
}
</style>
