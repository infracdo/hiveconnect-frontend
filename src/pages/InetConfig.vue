<!-- eslint-disable camelcase -->
<template>
  <q-page padding>
    <q-table
      :rows="rows"
      title="For Provision"
      row-key="name"
      :columns="columns"
      :loading="rows.length > 0 ? false : true"
      :pagination="{
        rowsPerPage: 10,
      }"
      :dense="$q.screen.lt.md"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            icon="assignment"
            @click="openModal(props.row.id)"
          />
        </q-td>
      </template>
      <template #top-right>
        <q-btn
          icon="autorenew"
          class="cursor-pointer q-mx-sm"
          @click="refreshTable"
          flat
        />
        <q-input
          v-model="filter"
          filled
          dense
          label="Search"
          debounce="300"
          color="primary"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <add-new-client
      :is-open="modalOpen"
      @open-modal="openModal"
      :serial-and-mac="serialAndMac"
      :client="client"
      :close-modal="closeModal"
    />
    <subscriber-modal :data-id="dataId" :get-subsribers="refreshTable" />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref, watchEffect } from 'vue';
import { useSubscriberStore } from 'src/stores/subscriber/subscriber-store';

import SubscriberModal from 'src/components/InetConfig/SubscriberModal.vue';
import {
  getClients,
  getClientById,
} from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs';
import addNewClient from '../components/InetConfig/AddNewClient.vue';
import { getDevices } from 'src/api/AcsApi/rougeDevicesApi';
import { IserialAndMac, IsubsriberType } from 'src/components/models';

const store = useSubscriberStore();
const dataId = ref<string>();
const rows = ref([]);
const filter = ref('');
const columns: QTableProps['columns'] = store.$state.subscribercolumns;
const modalOpen = ref(false);
let serialAndMac: IserialAndMac[] = [];
const client = ref<IsubsriberType>({
  id: 0,
  accountNumber: '',
  clientName: '',
  ipAssigned: '',
  onuSerialNumber: '',
  oltIp: '',
  onuMacAddress: '',
  packageTypeId: '',
});
const openModal = async (id: number) => {
  modalOpen.value = !modalOpen.value;
  const rogueDevice = await getDevices();

  serialAndMac = rogueDevice.map(
    (device: { serial_number: string; mac_address: string }) => ({
      serial_number: device.serial_number,
      mac_address: device.mac_address,
    })
  );
  client.value = await getClientById(id);
};

const closeModal = () => {
  modalOpen.value = !modalOpen.value;
};

const refreshTable = async () => {
  rows.value = [];
  rows.value = await getClients();
};
watchEffect(async () => {
  rows.value = await getClients();
});
</script>

<style scoped></style>
