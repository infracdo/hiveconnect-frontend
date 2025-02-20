<template>
  <div
    class="flex flex-row absolute bottom-0 position items-center mx-4 py-2 space-x-2 w-full"
  >
    <q-avatar size="32px">
      <img src="/sample_avatar.jpeg" />
    </q-avatar>

    <p class="text-sm font-medium text-black cursor-default">
      {{ $keycloak.tokenParsed.given_name }}
      {{ $keycloak.tokenParsed.family_name }}
    </p>

    <q-btn flat rounded dense class="text-gray-iron-500 rounded-full">
      <q-icon name="settings" />

      <q-menu
        transition-show="scale"
        transition-hide="scale"
        class="text-grey-9"
      >
        <div class="row no-wrap q-pa-none">
          <q-list style="min-width: 300px">
            <q-item @click="logout()" clickable>
              <q-item-section avatar style="width: 20px">
                <q-icon name="logout" class="text-grey-7" size="sm" />
              </q-item-section>

              <q-item-section> Logout </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { keycloak } from "src/boot/keycloak";

const logout = () => {
  console.log("Logout button is clicked.");
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};
</script>
