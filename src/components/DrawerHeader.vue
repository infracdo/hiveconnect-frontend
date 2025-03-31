<template>
  <div class="flex flex-row m-4 gap-2">
    <!-- Hive Logo -->
    <img
      src="/public/icons/bee-hive-32x32.png"
      class="w-8 h-8 mt-2 mb-2 cursor-default"
    />

    <!-- App name and logged in user -->
    <div class="flex flex-col flex-grow">
      <p class="font-bold text-base text-gray-iron-700 cursor-default">Hive</p>

      <div class="flex flex-row items-center justify-between">
        <p
          class="text-sm text-regular text-gray-iron-500 leading-none cursor-default"
        >
          {{ keycloak.tokenParsed.given_name }}
        </p>

        <q-btn
          flat
          rounded
          dense
          class="text-gray-iron-500 rounded-full q-pa-none"
        >
          <q-icon name="keyboard_arrow_down" />

          <q-menu
            transition-show="scale"
            transition-hide="scale"
            class="text-grey-9"
          >
            <q-list style="min-width: 300px">
              <q-item @click="logout()" clickable>
                <q-item-section avatar style="width: 20px">
                  <q-icon name="logout" class="text-grey-7" size="sm" />
                </q-item-section>

                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useKeycloak } from "src/composables/useKeycloak";

const keycloak = useKeycloak();

const logout = () => {
  console.log("Logout button is clicked.");
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};
</script>
