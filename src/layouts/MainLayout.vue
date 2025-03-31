<template>
  <q-layout view="lhh lpR lFf" class="bg-hiveconnect-slate pr-4">
    <q-drawer
      show-if-above
      v-model="drawer"
      :mini="!drawer || miniState"
      @click.capture="drawerClick"
      :width="330"
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
          <DrawerTile
            title="Subscribers for Provisioning"
            icon="bi-person-fill-gear"
            to="inetconfig"
          />

          <DrawerExpansionTile title="Subscribers" icon="bi-people-fill">
            <DrawerTileChild
              title="Active/Onhold Subscribers"
              to="provisioned"
            />
            <DrawerTileChild title="Subscribers for Migration" to="migration" />
          </DrawerExpansionTile>

          <DrawerTile
            title="Rogue Devices"
            icon="bi-router-fill"
            to="roguedevices"
          />

          <DrawerTile
            title="Addresses"
            icon="bi-hdd-network-fill"
            to="network-address"
          />

          <DrawerTile
            title="Active/Onhold Subscribers Report"
            icon="bi-stickies-fill"
            to="provisionedreport"
          />

          <DrawerTile
            title="Troubleshoot"
            icon="bi-wrench"
            to="troubleshooting"
          />

          <!-- <EssentialLink
            v-for="link in filteredLinksList"
            :key="link.title"
            v-bind="link"
          /> -->

          <!-- <div class="flex-grow"></div> -->
          <!-- <DrawerFooter /> -->
        </q-list>
      </q-scroll-area>
      <!-- <div class="flex flex-row"></div> -->
    </q-drawer>

    <q-page-container class="scrollable-page-container">
      <div class="bg-white rounded-t-lg">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// import Logout from "src/components/Logout.vue";
import { onMounted, ref, watch } from "vue";
// import { keycloak } from "src/boot/keycloak";
import { useQuasar } from "quasar";
import { useKeycloak } from "src/composables/useKeycloak";
import EssentialLink, {
  EssentialLinkProps,
} from "components/EssentialLink.vue";
import DrawerHeader from "src/components/DrawerHeader.vue";
// import DrawerFooter from "src/components/DrawerFooter.vue";
import DrawerTile from "src/components/DrawerTile.vue";
import DrawerTileChild from "src/components/DrawerTileChild.vue";
import DrawerExpansionTile from "src/components/DrawerExpansionTile.vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const keycloak = useKeycloak();
const isDarkMode = ref(true);
const miniState = ref(false);
const drawer = ref(false);
const router = useRouter();
const activeLink = ref<string>("");

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
    title: "Migration Subscribers",
    icon: "bi-people-fill",
    link: "/migration",
    roles: ["HIVECONNECT_ROGUE_DEVICES_VIEW"],
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
  {
    title: "Active/Onhold Subscribers Report",
    icon: "bi-wrench",
    link: "/provisioned-report",
    roles: ["HIVECONNECT_PROVISIONED_VIEW"],
  },
];

const navigate = (link: string) => {
  activeLink.value = link;
  router.push(`/${link}`);
};

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
// )

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

<style scoped>
.scrollable-page-container {
  height: 100vh;
  overflow-y: auto;
}
</style>

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
