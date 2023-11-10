<template>
  <q-page padding class="items-center justify-evenly">
    <q-table
      :rows="tableRow"
      :title="`Rogue ${tableRow.length < 2 ? 'Device' : 'Devices'}`"
      :columns="columns"
      row-key="id"
      :dense="$q.screen.lt.md"
      :loading="loading"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from "quasar";

import { IdeviceType } from "../components/models";

import { ref, onMounted } from "vue";
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";

import { getDevices } from "src/api/NetworkAddressAPI.ts/networkAddressAPIs";
const store = useDevicesStore();
const tableRow = ref<IdeviceType[]>([]);
const columns: QTableProps["columns"] = store.$state.devicesColumn;
const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    tableRow.value = await getDevices();
  } catch (error) {}
  loading.value = false;
});
</script>

<style scoped></style>
