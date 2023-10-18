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
      :filter="filter"
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
          <q-btn
            dense
            round
            flat
            icon="build"
            @click="
              openTroubleshootModal(props.row.onuDeviceName, props.row.id)
            "
            :disable="
              props.row.onuDeviceName === null || props.row.onuDeviceName === ''
            "
          >
            <q-tooltip
              v-if="
                props.row.onuDeviceName === null ||
                props.row.onuDeviceName === ''
              "
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
            >
              Device Name Missing!
            </q-tooltip>
          </q-btn>
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
    <troubleshoot-client
      :confirm="openTroubleShootModal"
      :close-modal="closeTroubleShootModal"
      :device-name="deviceName"
      :clientId="clientId"
    ></troubleshoot-client>
    <subscriber-modal :data-id="dataId" :get-subsribers="refreshTable" />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref, watchEffect, watch } from 'vue';
import { useSubscriberStore } from 'src/stores/subscriber/subscriber-store';
import TroubleshootClient from 'src/components/InetConfig/TroubleshootClient.vue';
import SubscriberModal from 'src/components/InetConfig/SubscriberModal.vue';
import {
  getClients,
  getClientById,
} from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs';
import addNewClient from '../components/InetConfig/AddNewClient.vue';
import { getDevices } from 'src/api/AcsApi/rougeDevicesApi';
import { IserialAndMac, IsubsriberType } from 'src/components/models';

const disableTroubleshootBtn = ref(true);
const store = useSubscriberStore();
const dataId = ref<string>();
const rows = ref([]);
const filter = ref('');
const columns: QTableProps['columns'] = store.$state.subscribercolumns;
const modalOpen = ref(false);
const deviceName = ref('');
const clientId = ref(0);
const openTroubleShootModal = ref(false);
let serialAndMac: IserialAndMac[] = [];
const client = ref<IsubsriberType>({
  id: 0,
  accountNumber: '',
  clientName: '',
  ipAssigned: '',
  onuSerialNumber: '',
  oltIp: '',
  onuDeviceName: '',
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
const openTroubleshootModal = (onuDeviceName: string, id: number) => {
  deviceName.value = onuDeviceName;
  clientId.value = id;
  openTroubleShootModal.value = !openTroubleShootModal.value;
};
const closeTroubleShootModal = () => {
  openTroubleShootModal.value = !openTroubleShootModal.value;
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
