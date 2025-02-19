<!-- eslint-disable camelcase -->
<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headings here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            New Client Provision
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }} new subscribers
          </p>
        </div>

        <!-- Table controls here -->
        <div class="flex flex-row justify-between w-full">
          <!-- Search bar filter -->
          <div class="flex flex-row q-gutter-x-sm">
            <SearchBar
              :modelValue="filter"
              @update:searchValue="filter = $event"
              :searchFunction="handleSearch"
              hint="Search by ID or account number"
            />
          </div>

          <!-- Refresh icon and dropdown button here -->
          <div class="flex flex-row q-gutter-x-md items-center">
            <!-- Refresh icon -->
            <!-- TODO: when refresh button is clicked, it should trigger a spinner for visibility -->
            <q-icon
              flat
              name="autorenew"
              size="sm"
              class="cursor-pointer"
              @click="refreshTable"
            />

            <!-- Dropdown button to select what columns should be displayed in the table -->
            <!-- TODO: the checkbox should be checked by default -->
            <DropdownButton
              @select="handleColumnSelect"
              :columnOptions="columnOptions"
              :showCheckbox="true"
              :selectedOptions="visibleColumns"
              label="Select Visible Columns"
            />
          </div>
        </div>

        <!-- Content container here -->
        <div
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg relative"
        >
          <!-- Table for NEW status clients (to be provision) -->
          <div class="full-width p-3">
            <Table
              :tableColumns="newClientColumns"
              :tableRows="filteredRows"
              :visibleColumns="visibleColumns"
              :rowsPerPage="10"
              @rowClick="openModal"
            >
              <!-- Actions column provision action button-->
              <template #actions="{ row }">
                <div class="flex gap-2">
                  <q-icon
                    name="assignment"
                    size="sm"
                    class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                    @click="openModal(row)"
                  />
                </div>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Display modal when a row (client data) is clicked -->
    <Modal
      :isVisible="modalIsVisible"
      :title="'Provision Client'"
      @update:isVisible="modalIsVisible = $event"
      :actionHandler="handleActivateClient"
      :showSaveButton="true"
    >
      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Account number input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="client.accountNo"
          label="Account Number"
          @input="noLeadingWhitespace"
          readonly
          required
        />

        <!-- Client name input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="client.subscriberName"
          label="Client Name"
          @input="noLeadingWhitespace"
          readonly
          required
        />

        <!-- Package type input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="client.packageType"
          label="Package Type"
          @input="noLeadingWhitespace"
          readonly
          required
        />
      </div>

      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- ONU serial number select field -->
        <Selects
          v-model="client.onuSerialNumber"
          label="ONU Serial Number"
          :options="[
            { label: 'SN12345678', value: 'SN12345678' },
            { label: 'SN98765432', value: 'SN98765432' },
            { label: 'SN56789012', value: 'SN56789012' },
            { label: 'SN34567890', value: 'SN34567890' },
            { label: 'SN87654321', value: 'SN87654321' },
          ]"
          required
        />

        <!-- ONU mac address input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="client.onuMacAddress"
          label="ONU Mac Address"
          @input="noLeadingWhitespace"
          required
        />
      </div>

      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Location select field -->
        <Selects
          v-model="client.location"
          label="Select Location"
          :options="[
            { label: 'CDO', value: 'CDO' },
            { label: 'Malaybalay', value: 'Malaybalay' },
            { label: 'Davao', value: 'Davao' },
            { label: 'Makati', value: 'Makati' },
          ]"
          required
          class="w-full"
        />
      </div>

      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Network site (vlan) select field -->
        <Selects
          v-model="client.networkSiteVlan"
          label="Select Network Site (VLAN)"
          :options="[
            { label: 'VLAN-101', value: 'VLAN-101' },
            { label: 'VLAN-202', value: 'VLAN-202' },
            { label: 'VLAN-303', value: 'VLAN-303' },
            { label: 'VLAN-404', value: 'VLAN-404' },
            { label: 'VLAN-505', value: 'VLAN-505' },
          ]"
          required
          class="w-full"
        />

        <!-- OLT ip select field -->
        <Selects
          v-model="client.oltIp"
          label="Select OLT IP"
          :options="[
            { label: '192.168.1.1', value: '192.168.1.1' },
            { label: '10.0.0.1', value: '10.0.0.1' },
            { label: '172.16.100.1', value: '172.16.100.1' },
            { label: '192.168.50.1', value: '192.168.50.1' },
            { label: '10.10.10.1', value: '10.10.10.1' },
          ]"
          required
          class="w-full"
        />
      </div>
    </Modal>
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
import {
  IClient,
  IOltSiteByIp,
  GroupedNetworkSite,
} from "src/api/HiveConnectApis/types";
import addNewClient from "../components/InetConfig/ProvisionClient.vue";

import { IserialAndMac, IsubsriberType } from "src/components/models";

// Recently added
import Swal from "sweetalert2";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";
import Modal from "src/components/Modal.vue";
import Inputs from "src/components/inputs/Inputs.vue";
import Selects from "src/components/inputs/Selects.vue";

const right = ref(false);
const $q = useQuasar();
const store = useSubscriberStore();
const dataId = ref<string>();
const rows = ref<IClient[]>([]);

// const visibleColumns = ref([
//   "newSubscriberId",
//   "subscriberAccountNumber",
//   "subscriberName",
//   "packageType",
//   "actions",
// ]);

// const columnOptions = ref([
//   { value: "newSubscriberId", label: "Subscriber ID" },
//   { value: "subscriberAccountNumber", label: "Account Number" },
//   { value: "subscriberName", label: "Subscriber Name" },
//   { value: "packageType", label: "Package Type" },
//   { value: "actions", label: "Actions" },
// ]);

// Store typed search terms from SearchBar; defaults to null
const filter = ref("");
// Recently updated: added null array in case of no data resulting to 'undefined' in columns props.
// TODO: re-check this
const columns: QTableProps["columns"] = store.$state.subscribercolumns || []; // define all the visible columns in Provision
const modalOpen = ref(false);
const deviceName = ref("");
const clientId = ref(0);
const openTroubleShootModal = ref(false);
const loading = ref(false);
let serialAndMac: IserialAndMac[] = [];
// const client = ref<IsubsriberType>({
//   newSubscriberId: 0,
//   bucketId: 0, //added
//   subscriberAccountNumber: "",
//   subscriberName: "",
//   ipAssigned: "",
//   onuSerialNumber: "",
//   oltIp: "",
//   //@ts-ignore
//   ssidName: "",
//   onuDeviceName: "",
//   onuMacAddress: "",
//   packageType: "",
//   oltReportedUpstream: 0,
//   oltReportedDownstream: 0,
// });

// const openModal = async (newSubscriberId: number) => {
//   $q.loading.show();
//   const rogueDevice = await getDevices();

//   serialAndMac = rogueDevice.map(
//     (device: { serial_number: string; mac_address: string }) => ({
//       serial_number: device.serial_number,
//       mac_address: device.mac_address,
//     })
//   );

//   client.value = await getClientById(newSubscriberId);
//   console.log(client.value);
//   modalOpen.value = !modalOpen.value;
//   $q.loading.hide();
// };

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

// RECENTLY ADDED!!
const modalIsVisible = ref(false);

// Function to update the filter value when the user types in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

// Filtered rows based on search term
const filteredRows = computed(() => {
  if (!filter.value) return newClientRows.value;

  const searchTerm = filter.value.toLowerCase();
  return newClientRows.value.filter((row) => {
    return (
      row.id.toString().toLowerCase().includes(searchTerm) ||
      row.accountNo.toLowerCase().includes(searchTerm) ||
      row.subscriberName.toLowerCase().includes(searchTerm) ||
      row.packageType.toLowerCase().includes(searchTerm)
    );
  });
});

// Count total number of rows (clients) to display it in the description
// Recently updated: from 'rows.value.length'
const clientCount = computed(() => newClientRows.value.length);

const handleColumnSelect = (selectedOptions: string[]) => {
  visibleColumns.value = selectedOptions;
  localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
};

// Note: for testing purposes
const columnOptions = ref([
  { value: "id", label: "Subscriber ID" },
  { value: "accountNo", label: "Account Number" },
  { value: "subscriberName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
]);

// Load saved data from localStorage on component mount
const savedVisibleColumns = localStorage.getItem("visibleColumns");
const visibleColumns = ref<string[]>(
  savedVisibleColumns
    ? JSON.parse(savedVisibleColumns)
    : ["id", "accountNo", "subscriberName", "packageType", "actions"]
);

// Note: for testing purposes only remove this!!
// Define the client object
interface Client {
  accountNo: string;
  subscriberName: string;
  packageType: string;
  onuSerialNumber: number;
  onuMacAddress: string;
  location: string;
  networkSiteVlan: string;
  oltIp: string;
}
const client = ref<Client>({
  accountNo: "",
  subscriberName: "",
  packageType: "",
  onuSerialNumber: 0,
  onuMacAddress: "",
  location: "",
  networkSiteVlan: "",
  oltIp: "",
});

// Method to display modal when a row is clicked
const openModal = (row: any) => {
  client.value = {
    accountNo: row.accountNo,
    subscriberName: row.subscriberName,
    packageType: row.packageType,
    onuSerialNumber: row.onuSerialNumber,
    onuMacAddress: row.onuMacAddress,
    location: row.location,
    networkSiteVlan: row.networkSiteVlan,
    oltIp: row.oltIp,
  };
  modalIsVisible.value = true;
};

// Method to trigger form activate button in modal
const handleActivateClient = async () => {
  // Sweetalert2 for confirmation and sucess alerts

  // Show confirmation alert
  const confirmResult = await Swal.fire({
    title: "Confirm",
    text: "Are you sure you want to activate this client?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1d6499",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, activate it",
    reverseButtons: true,
    allowOutsideClick: false,
  });

  // Display success alert when activate button is clicked
  if (confirmResult.isConfirmed) {
    try {
      Swal.fire({
        title: "Success",
        text: "Client provisioned successfully.",
        icon: "success",
        confirmButtonColor: "#1d6499",
        confirmButtonText: "Confirm",
        allowOutsideClick: false,
      });

      client.value = {
        accountNo: "",
        subscriberName: "",
        packageType: "",
        onuSerialNumber: 0,
        onuMacAddress: "",
        location: "",
        networkSiteVlan: "",
        oltIp: "",
      };

      modalIsVisible.value = false;
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Error activating client",
        icon: "error",
        confirmButtonColor: "#fd0808",
      });
    }
  }
};

// Define inputValue
const inputValue = ref("");
// Method to remove leading whitespace in inputs during typing
const noLeadingWhitespace = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/^\s+/, "");
  inputValue.value = input.value;
};

// NOTE: Sample hardcoded columns and rows for testing purposes
const newClientColumns = ref([
  {
    name: "id",
    align: "left",
    label: "ID",
    field: "id",
  },
  {
    name: "accountNo",
    align: "left",
    label: "Account No.",
    field: "accountNo",
  },
  {
    name: "subscriberName",
    align: "left",
    label: "Subscriber Name",
    field: "subscriberName",
  },
  {
    name: "packageType",
    align: "left",
    label: "Package Type",
    field: "packageType",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
  },
]);

const newClientRows = ref([
  {
    id: 1,
    accountNo: "RES-202402-15",
    subscriberName: "JANE DOE",
    packageType: "PLAN999",
    actions: "test",
  },
  {
    id: "1",
    accountNo: "RES-202402-15",
    subscriberName: "JANE DOE",
    packageType: "PLAN999",
    actions: "test",
  },
  {
    id: "2",
    accountNo: "RES-202402-16",
    subscriberName: "JOHN SMITH",
    packageType: "PLAN1499",
    actions: "test",
  },
  {
    id: "3",
    accountNo: "RES-202402-17",
    subscriberName: "ALICE JOHNSON",
    packageType: "PLAN1999",
    actions: "test",
  },
  {
    id: "4",
    accountNo: "RES-202402-18",
    subscriberName: "BOB WILLIAMS",
    packageType: "PLAN799",
    actions: "test",
  },
  {
    id: "5",
    accountNo: "RES-202402-19",
    subscriberName: "EMILY BROWN",
    packageType: "PLAN2500",
    actions: "test",
  },
]);
</script>

<style scoped lang="sass"></style>
