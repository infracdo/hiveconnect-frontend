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

        <q-toolbar-title class="text-left">
          Hive Connect
        </q-toolbar-title>

        <div>
          <q-btn
            label="John Doe dela Santos"
            icon-right="bi-person"
            align="between"
            flat
            no-caps

          >
            <q-menu
              fit
              style="width: 210px;"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <q-list class="text-grey-9">
                <q-item clickable>
                  <q-item-section avatar>
                    <div class="row items-end">
                      <q-icon name="bi-person" size="20px" class="q-mr-md"/>
                      <q-item-label>Profile</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section avatar>
                    <div class="row items-center">
                      <q-icon name="bi-gear" size="20px" class="q-mr-md"/>
                      <q-item-label>Settings</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="$q.dark.toggle()">
                  <q-item-section avatar>
                    <div class="row items-center">
                      <q-icon :name="!$q.dark.isActive? 'bi-brightness-high' : 'bi-moon-stars'" size="20px" class="q-mr-md"/>
                      <q-item-label>{{ $q.dark.isActive ? 'Dark' : 'Light' }} Mode</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
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
import { ref, watch } from "vue";
import EssentialLink, {
  EssentialLinkProps,
} from "components/EssentialLink.vue";

import { useQuasar } from "quasar";

const $q = useQuasar();
const essentialLinks: EssentialLinkProps[] = [
  {
    title: "Provision",
    icon: "bi-person-fill-gear",
    link: "/inet-config",
  },
  {
    title: "Hive Provisioned",
    icon: "bi-person-fill-check",
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
    icon: "bi-wrench",
    link: "/troubleshooting",
  },
];

const leftDrawerOpen = ref(false);
const isDarkMode = ref(true);
const miniState = ref(true)

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
