<template>
  <q-layout view="hHh lpR lFf" style="min-height: 0">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          class="header-btn"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-center"> Hive Connect </q-toolbar-title>
        <Logout />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navgation </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-tabs indicator-color="white" active-color="white">
        <q-route-tab
          v-for="link in essentialLinks"
          :key="link.title"
          :icon="link.icon"
          :to="link.link"
        /> </q-tabs
    ></q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import Logout from "src/components/Logout.vue";
import { ref } from "vue";
import EssentialLink, {
  EssentialLinkProps,
} from "components/EssentialLink.vue";

const essentialLinks: EssentialLinkProps[] = [
  {
    title: "Provision",
    icon: "settings",
    link: "/inet-config",
  },
  {
    title: "Hive Provisioned",
    icon: "how_to_reg",
    link: "/provisioned",
  },
  {
    title: "Rogue Devices",
    icon: "device_unknown",
    link: "/rogue-devices",
  },
  {
    title: "Network Address",
    icon: "podcasts",
    link: "/network-address",
  },
  {
    title: "Troubleshoot",
    icon: "build",
    link: "/troubleshooting",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.header-btn {
  display: none;
}
@media screen and (min-width: 600px) {
  .q-footer {
    display: none;
  }
  .header-btn {
    display: block;
  }
}
</style>
