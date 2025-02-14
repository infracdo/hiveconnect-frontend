<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar class="items-center q-pa-sm q-gutter-xs">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          size="18px"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-left"> Hive Connect </q-toolbar-title>

        <div v-if="$keycloak.authenticated">
          <q-btn icon-right="bi-person" align="between" flat no-caps>
            <div align="between" class="q-mr-xs">
              {{ $keycloak.tokenParsed.preferred_username }}
            </div>
            <q-menu
              fit
              style="width: 210px"
              transition-show="jump-down"
              transition-hide="jump-up"
              class="column no-wrap q-pa-md"
            >
              <div class="row items-center q-my-xs">
                <q-icon name="account_circle" size="40px" />
                <div class="q-ml-xs">
                  <p class="q-ma-none">
                    {{ $keycloak.tokenParsed.given_name }}
                    {{ $keycloak.tokenParsed.family_name }}
                  </p>
                  <p class="q-ma-none">{{ $keycloak.tokenParsed.email }}</p>
                </div>
              </div>
              <q-separator class="q-my-xs" />
              <q-list class="text-grey-9">
                <q-item clickable @click="$q.dark.toggle()">
                  <q-item-section avatar>
                    <div class="row items-center">
                      <q-icon
                        :name="
                          !$q.dark.isActive
                            ? 'bi-brightness-high'
                            : 'bi-moon-stars'
                        "
                        size="20px"
                        class="q-mr-md"
                      />
                      <q-item-label
                        >{{
                          $q.dark.isActive ? "Dark" : "Light"
                        }}
                        Mode</q-item-label
                      >
                    </div>
                  </q-item-section>
                </q-item>
                <Logout />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      bordered
      :width="300"
      :breakpoint="500"
    >
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <EssentialLink
          v-for="link in filteredLinksList"
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
import { onMounted, ref, watch } from "vue";
import { keycloak } from "src/boot/keycloak";
import EssentialLink, {
  EssentialLinkProps,
} from "components/EssentialLink.vue";

import { useQuasar } from "quasar";
import router from "src/router";

const $q = useQuasar();
const essentialLinks = [
  {
    title: "Provision",
    icon: "bi-person-fill-gear",
    link: "/inet-config",
    roles: ["HIVECONNECT_PROVISIONING_VIEW"],
  },
  {
    title: "Hive Provisioned",
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

const leftDrawerOpen = ref(false);
const isDarkMode = ref(true);
const miniState = ref(true);

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

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
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
</style>
