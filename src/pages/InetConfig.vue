<!-- eslint-disable camelcase -->
<template>
  <q-page padding>
    <q-table
      :rows="rows"
      class="my-sticky-last-column-table"
      row-key="name"
      title="New Client Provision"
      :columns="columns"
      :loading="loading || rows.length === 0"
      :pagination="{
        rowsPerPage: 10,
      }"
      :dense="$q.screen.lt.md"
      :filter="filter"
      :visible-columns="visibleColumns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            icon="assignment"
            @click="openModal(props.row.newSubscriberId)"
          />
        </q-td>
      </template>
      <!-- <template #body-cell-packageTypeId="props">
        <q-td :props="props">
          {{ packageType(props.row.packageTypeId) }}
        </q-td>
      </template> -->
      <template #top-right>
        <div class="table-top-right">
          <q-input
            v-model="filter"
            filled
            dense
            placeholder="Search"
            debounce="300"
            color="primary"
            clearable
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="optionColumns"
            :anchor="'top right'"
            :self="'top left'"
            style="min-width: 150px"
          /> -->

          <q-select
            v-model="visibleColumns"
            :options="columnOptions"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            filled
            :anchor="'top right'"
            :self="'top left'"
            style="min-width: 230px"
            fit
          >
            <template
              v-slot:option="{ itemProps, opt, selected, toggleOption }"
            >
              <q-item v-bind="itemProps">
                <q-item-section side>
                  <q-checkbox
                    :model-value="selected"
                    @update:model-value="(val) => toggleOption(opt)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-icon
            name="autorenew"
            class="cursor-pointer q-ma-sm"
            size="sm"
            flat
            @click="refreshTable"
          />
        </div>
      </template>
    </q-table>

    <add-new-client
      :is-open="modalOpen"
      :serial-and-mac="serialAndMac"
      :client="client"
      :close-modal="closeModal"
      @open-modal="openModal"
    />
    <!-- <troubleshoot-client
      :confirm="openTroubleShootModal"
      :close-modal="closeTroubleShootModal"
      :device-name="deviceName"
      :clientId="clientId"
    ></troubleshoot-client> -->
    <subscriber-modal :data-id="dataId" :get-subscribers="refreshTable" />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from "quasar";
import { ref, watchEffect, watch, onMounted, computed } from "vue";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
// import TroubleshootClient from "src/components/InetConfig/TroubleshootClient.vue";
import SubscriberModal from "src/components/InetConfig/SubscriberModal.vue";
import {
  getClients,
  getClientById,
  getDevices,
  checkPackageDetails,
  getNetworkSiteOltIp,
} from "src/api/HiveConnectApis/hiveConnect";
import { IClient, IOltSiteByIp, GroupedNetworkSite } from "src/api/HiveConnectApis/types";
import addNewClient from "../components/InetConfig/ProvisionClient.vue";

import { IserialAndMac, IsubsriberType } from "src/components/models";

const right = ref(false);
const $q = useQuasar();
const store = useSubscriberStore();
const dataId = ref<string>();
const rows = ref<IClient[]>([]);

const visibleColumns = ref([
  "newSubscriberId",
  "subscriberAccountNumber",
  "subscriberName",
  "packageType",
  "actions",
]);

const columnOptions = ref([
  { value: "newSubscriberId", label: "Subscriber ID" },
  { value: "subscriberAccountNumber", label: "Account Number" },
  { value: "subscriberName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
  { value: "actions", label: "Actions" },
]);

const filter = ref("");
const columns: QTableProps["columns"] = store.$state.subscribercolumns; // define all the visible columns in Provision
const modalOpen = ref(false);
const deviceName = ref("");
const clientId = ref(0);
const openTroubleShootModal = ref(false);
const loading = ref(false);
let serialAndMac: IserialAndMac[] = [];
const client = ref<IsubsriberType>({
  newSubscriberId: 0,
  bucketId: 0, //added
  subscriberAccountNumber: "",
  subscriberName: "",
  ipAssigned: "",
  onuSerialNumber: "",
  oltIp: "",
  //@ts-ignore
  ssidName: "",
  onuDeviceName: "",
  onuMacAddress: "",
  packageType: "",
  oltReportedUpstream: 0,
  oltReportedDownstream: 0,
});

const openModal = async (newSubscriberId: number) => {
  $q.loading.show();
  const rogueDevice = await getDevices();

  serialAndMac = rogueDevice.map(
    (device: { serial_number: string; mac_address: string }) => ({
      serial_number: device.serial_number,
      mac_address: device.mac_address,
    })
  );

  client.value = await getClientById(newSubscriberId);
  console.log(client.value);
  modalOpen.value = !modalOpen.value;
  $q.loading.hide();
};

const closeModal = () => {
  modalOpen.value = !modalOpen.value;
};
const openTroubleshootModal = (
  onuDeviceName: string,
  newSubscriberId: number
) => {
  deviceName.value = onuDeviceName;
  clientId.value = newSubscriberId;
  openTroubleShootModal.value = !openTroubleShootModal.value;
};
const closeTroubleShootModal = () => {
  openTroubleShootModal.value = !openTroubleShootModal.value;
};
const refreshTable = async () => {
  //getClient from clients_for_activation db, Account table
  rows.value = [];
  filter.value = "";
  loading.value = true;
  try {
    rows.value = await getClients();
  } finally {
    loading.value = false;
  }
};
const getAllClients = async () => {
  try {
    await refreshTable();
  } catch (error) {
    throw new Error("Cannot get Clients info.");
  }
};
onMounted(getAllClients);
</script>

<style scoped lang="sass"></style>
