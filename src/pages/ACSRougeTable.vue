<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Rogue Devices
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ rogueDeviceCount }} rogue
            {{ rogueDeviceCount < 2 ? "device" : "devices" }}
          </p>
        </div>

        <!-- Content container here -->
        <div
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg"
        >
          <!-- Rogue devices table here -->
          <div class="full-width">
            <Table
              :tableRows="tableRow"
              :tableColumns="columns"
              pagination
              :rowsPerPage="10"
              :loading="loading"
            >
            </Table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from "quasar";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";
import { IRogueDevices } from "src/api/HiveConnectApis/types";
import {
  getRogueDevices,
  addFrontendLogger,
} from "src/api/HiveConnectApis/hiveConnect";
import { useKeycloak } from "src/composables/useKeycloak";
import Table from "src/components/Table.vue";

const route = useRoute();
const keycloak = useKeycloak();
const store = useDevicesStore();
const tableRow = ref<IRogueDevices[]>([]);
const columns: QTableProps["columns"] = store.$state.devicesColumn || [];
const loading = ref<boolean>(false);

// Count total number of rows (devices) to display in the page description
const rogueDeviceCount = computed(() => tableRow.value.length || 0);

// Asynchronous function to retrieve devices data through API call
async function fetchRogueDevices() {
  loading.value = true;
  try {
    tableRow.value = await getRogueDevices();
  } catch (error) {
    console.log("Error fetching devices for Rogue Devices page: ", error);
  }
  loading.value = false;
}

onMounted(async () => {
  await fetchRogueDevices();

  // Send a frontend logger to backend for writing .log files
  const user = keycloak.tokenParsed.given_name;
  const action = "page visit";
  const details = `${user} visited the ${route.path} page`;
  const page = route.path?.toString() || "Unknown Page";
  const userAgent = navigator.userAgent;

  addFrontendLogger(user, action, details, page, userAgent)
    .then(() => console.log("Frontend log sent successfully."))
    .catch((error) => console.error("Error sending frontend log: ", error));
});
</script>
