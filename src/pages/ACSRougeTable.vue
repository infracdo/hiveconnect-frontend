<template>
  <q-page padding class="items-center justify-evenly">
    <q-table
      :rows="tableRow"
      :title="`Rogue ${tableRow.length < 2 ? 'Device' : 'Devices'}`"
      :columns="columns"
      row-key="id"
      :dense="$q.screen.lt.md"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
// import axios from 'src/boot/axios'
import { IdeviceType } from '../components/models';

import { ref, onMounted } from 'vue';
import { useDevicesStore } from 'src/stores/rogue-device/rogue-devices';
import { getDevices } from '../api/AcsApi/rougeDevicesApi';
const store = useDevicesStore();
const tableRow = ref<IdeviceType[]>([]);
const columns: QTableProps['columns'] = store.$state.devicesColumn;

onMounted(async () => {
  tableRow.value = await getDevices();
  getDevices();
});
</script>

<style scoped></style>
