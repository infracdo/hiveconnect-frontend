<!-- eslint-disable camelcase -->
<template>
  <q-page padding>
    <q-table
      class="my-sticky-last-column-table"
      :rows="rows"
      title="For Provision"
      row-key="name"
      :columns="columns"
      :loading="loading"
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
              openTroubleshootModal(
                props.row.onuDeviceName + '-' + props.row.ipAssigned,
                props.row.id
              )
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
        <q-icon
          name="autorenew"
          class="cursor-pointer q-ma-sm"
          size="sm"
          @click="refreshTable"
          flat
        />
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
import { QTableProps } from "quasar";
import { ref, watchEffect, watch, onMounted } from "vue";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
import TroubleshootClient from "src/components/InetConfig/TroubleshootClient.vue";
import SubscriberModal from "src/components/InetConfig/SubscriberModal.vue";
import {
  getClients,
  getClientById,
} from "src/api/NetworkAddressAPI.ts/networkAddressAPIs";
import addNewClient from "../components/InetConfig/AddNewClient.vue";
import { getDevices } from "src/api/AcsApi/rougeDevicesApi";
import { IserialAndMac, IsubsriberType } from "src/components/models";
import { useQuasar } from "quasar";
import { text } from "body-parser";

const $q = useQuasar();
const store = useSubscriberStore();
const dataId = ref<string>();
const rows = ref([]);

const filter = ref("");
const columns: QTableProps["columns"] = store.$state.subscribercolumns;
const modalOpen = ref(false);
const deviceName = ref("");
const clientId = ref(0);
const openTroubleShootModal = ref(false);
const loading = ref(false);
let serialAndMac: IserialAndMac[] = [];
const client = ref<IsubsriberType>({
  id: 0,
  accountNumber: "",
  clientName: "",
  ipAssigned: "",
  onuSerialNumber: "",
  oltIp: "",
  onuDeviceName: "",
  onuMacAddress: "",
  packageTypeId: "",
});
const openModal = async (id: number) => {
  $q.loading.show();
  const rogueDevice = await getDevices();

  serialAndMac = rogueDevice.map(
    (device: { serial_number: string; mac_address: string }) => ({
      serial_number: device.serial_number,
      mac_address: device.mac_address,
    })
  );
  console.log(serialAndMac);

  client.value = await getClientById(id);
  modalOpen.value = !modalOpen.value;
  $q.loading.hide();
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

const getAllClients = async () => {
  try {
    loading.value = true;
    rows.value = await getClients();
  } catch (error) {
    throw new Error("Cannot get Clients info.");
  }
  loading.value = false;
};
onMounted(async () => {
  getAllClients();
});
</script>

<style scoped lang="sass"></style>
