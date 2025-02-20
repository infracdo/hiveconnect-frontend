<template>
  <q-layout view="lhh lpR lFf" class="bg-hiveconnect-slate pr-4">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick"
      :width="289"
      :breakpoint="500"
      class="bg-hiveconnect-slate"
    >
      <q-scroll-area
        :horizontal-thumb-style="{ opacity: '0' }"
        style="height: 100%"
      >
        <DrawerHeader />
        <q-separator inset />
        <q-list padding dense>
          <EssentialLink
            v-for="link in filteredLinksList"
            :key="link.title"
            v-bind="link"
          />

          <div class="flex-grow"></div>
          <DrawerFooter />
        </q-list>
      </q-scroll-area>
      <div class="flex flex-row"></div>
    </q-drawer>

    <q-page-container>
      <div class="bg-white rounded-t-lg">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Logout from "src/components/Logout.vue";
import { onMounted, ref, watch } from "vue";
import { keycloak } from "src/boot/keycloak";
import { useQuasar } from "quasar";
import EssentialLink, {
  EssentialLinkProps,
} from "components/EssentialLink.vue";
import DrawerHeader from "src/components/DrawerHeader.vue";
import DrawerFooter from "src/components/DrawerFooter.vue";
import router from "src/router";

const $q = useQuasar();

const leftDrawerOpen = ref(false);
const drawerClick = () => {
  if (miniState.value) {
    miniState.value = false;
  }
};

const essentialLinks = [
  {
    title: "Provision",
    icon: "bi-person-fill-gear",
    link: "/inet-config",
    roles: ["HIVECONNECT_PROVISIONING_VIEW"],
  },
  {
    title: "Provisioned Subscribers",
    icon: "bi-person-fill-check",
    link: "/provisioned",
    roles: ["HIVECONNECT_PROVISIONED_VIEW"],
  },
  {
    title: "Rogue Devices",
    icon: "device_unknown",
    link: "/rogue-devices",
    roles: ["HIVECONNECT_ROGUE_DEVICES_VIEW"],
  },
  {
    title: "Network Address",
    icon: "podcasts",
    link: "/network-address",
    roles: ["HIVECONNECT_ADDRESSES_VIEW"],
  },
  {
    title: "Troubleshoot",
    icon: "bi-wrench",
    link: "/troubleshooting",
    roles: ["HIVECONNECT_TROUBLESHOOTING_VIEW"],
  },
];

// const isDarkMode = ref(true);

// watch(
//   () => isDarkMode.value,
//   () => {
//     if (isDarkMode.value === true) {
//       $q.dark.toggle();
//     } else {
//       $q.dark.toggle();
//     }
//   }
// );
const isDarkMode = ref(true);
const miniState = ref(false);

const filteredLinksList = essentialLinks.filter((link) => {
  const resourceRoles =
    keycloak.tokenParsed?.resource_access["test-hiveconnect-frontend"].roles ||
    [];
  return !link.roles || link.roles.some((role) => resourceRoles.includes(role));
});

watch(
  () => isDarkMode.value,
  () => {
    if (isDarkMode.value === true) {
      $q.dark.toggle();
    } else {
      $q.dark.toggle();
    }
  }
);

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// }
</script>

<!-- <style scoped>
:deep(.q-btn.btn--no-hover .q-focus-helper) {
  display: none;
}
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
.centered-dropdown .q-btn-dropdown__caret {
  display: none;
}
</style> -->
