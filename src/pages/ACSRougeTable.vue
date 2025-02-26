<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page header here -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Rogue Devices
          </div>

          <!-- Page description here -->
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
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";
import { IRogueDevices } from "src/api/HiveConnectApis/types";
import { getDevices } from "src/api/HiveConnectApis/hiveConnect";
import Table from "src/components/Table.vue";

const store = useDevicesStore();
const tableRow = ref<IRogueDevices[]>([]);
const columns: QTableProps["columns"] = store.$state.devicesColumn || [];
const loading = ref<boolean>(false);

// Count total number of rows (devices) to display in the page description
const rogueDeviceCount = computed(() => tableRow.value.length || 0);

onMounted(async () => {
  loading.value = true;
  try {
    tableRow.value = await getDevices();
  } catch (error) {
    console.log("Error fetching devices for Rogue Devices page: ", error);
  }
  loading.value = false;
});
</script>
