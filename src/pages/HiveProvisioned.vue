<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Provisioned Subscribers
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }} active
            {{ clientCount < 2 ? "subscriber" : "subscribers" }}
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
              hint="Search by account number"
            />
          </div>

          <!-- Refresh icon and visible column selection here -->
          <div class="flex flex-row q-gutter-x-md items-center">
            <!-- Refresh icon to reload data -->
            <q-icon
              name="autorenew"
              size="sm"
              class="cursor-pointer"
              @click="getProvisioned"
            />

            <!-- Dropdown button to select which columns should be displayed in the table -->
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
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg"
        >
          <!-- Table for provisioned clients (active) -->
          <div class="full-width">
            <Table
              :tableColumns="columns"
              :tableRows="filteredRows"
              :visibleColumns="visibleColumns"
              :rowsPerPage="10"
              @rowClick="openModal"
            >
              <template #actions="{ row }">
                <q-icon
                  name="assignment"
                  size="sm"
                  class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                  @click="openTroubleshootModal(row.onuDeviceName, row.id)"
                />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Display troubleshoot modal when row is clicked-->
    <TroubleshootClient
      :isVisible="openTroubleShootModal"
      @update:isVisible="openTroubleShootModal = $event"
      :close-modal="closeTroubleShootModal"
      :device-name="deviceName"
      :clientId="clientId"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getHiveClients } from "src/api/HiveConnectApis/hiveConnect";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
import { useClientStore } from "src/stores/subscriber/client-store";
import { IHiveClient } from "src/api/HiveConnectApis/types";
import TroubleshootClient from "src/components/InetConfig/TroubleshootClient.vue";

// Recently added
import Swal from "sweetalert2";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";
import Modal from "src/components/Modal.vue";
import Buttons from "src/components/inputs/Buttons.vue";
import Selects from "src/components/inputs/Selects.vue";
import Inputs from "src/components/inputs/Inputs.vue";

const store = useClientStore();
// Recently updated: null array is passed if the data is undefined
const columns = store.$state.subscribercolumns || [];
const rowsHive = ref<IHiveClient[]>([]);
const deviceName = ref("");
const clientId = ref(0);
const openTroubleShootModal = ref(false);
const filter = ref("");
// const visibleColumns = ref([
//   "subscriberAccountNumber",
//   "subscriberName",
//   "ipAssigned",
//   "onuSerialNumber",
//   "onuMacAddress",
//   "oltIp",
//   "packageType",
//   "ssidName",
//   "actions",
// ]);

const loading = ref(false);
const openTroubleshootModal = (onuDeviceName: string, id: number) => {
  deviceName.value = onuDeviceName;
  console.log(typeof id, " id value is ", id);
  clientId.value = id;
  openTroubleShootModal.value = !openTroubleShootModal.value;
};

const closeTroubleShootModal = () => {
  openTroubleShootModal.value = !openTroubleShootModal.value;
};

onMounted(async () => {
  await getProvisioned();
});

const getProvisioned = async (): Promise<void> => {
  filter.value = "";
  loading.value = true;
  rowsHive.value = [];
  try {
    rowsHive.value = await getHiveClients();
  } catch (error) {}
  loading.value = false;
};

// ============================================================================

// RECENTLY ADDED!!!

// Function to update the filter value when the user enters something in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

// Filter rows based on search term
const filteredRows = computed(() => {
  if (!filter.value) return rowsHive.value;

  const searchTerm = filter.value.toLowerCase();
  return rowsHive.value.filter((row) => {
    return (
      row.id.toString().toLowerCase().includes(searchTerm) ||
      row.subscriberAccountNumber
        .toString()
        .toLowerCase()
        .includes(searchTerm) ||
      row.clientName.toString().toLowerCase().includes(searchTerm) ||
      row.packageType.toString().toLowerCase().includes(searchTerm) ||
      row.onuDeviceName.toString().toLowerCase().includes(searchTerm) ||
      row.ipAssigned.toString().toLowerCase().includes(searchTerm) ||
      row.onuSerialNumber.toString().toLowerCase().includes(searchTerm) ||
      row.onuMacAddress.toString().toLowerCase().includes(searchTerm) ||
      row.oltIp.toString().toLowerCase().includes(searchTerm) ||
      row.status.toString().toLowerCase().includes(searchTerm)
    );
  });
});

// Initialize modal display to false
const modalIsVisible = ref(false);

// NOTE: for testing purposes only remove this!!!
// Define the client object
interface Client {
  subscriberName: string;
  accountNo: string;
  packageType: string;
  onuStatus: string;
  onuIp: string;
  onuSerialNumber: number;
  onuMacAddress: string;
  upstream: string;
  downstream: string;
  oltStatus: string;
  oltIp: string;
  oltSite: string;
  oltInterface: string;
}

const client = ref(<Client>{
  subscriberName: "",
  accountNo: "",
  packageType: "",
  onuStatus: "",
  onuIp: "",
  onuSerialNumber: 0,
  onuMacAddress: "",
  upstream: "",
  downstream: "",
  oltStatus: "",
  oltIp: "",
  oltSite: "",
  oltInterface: "",
});

// Method to display modal when the action button in row is clicked
const openModal = (row: any) => {
  client.value = {
    subscriberName: row.clientName,
    accountNo: row.subscriberAccountNumber,
    packageType: row.packageType,
    onuStatus: row.onuStatus,
    onuIp: row.onuIp,
    onuSerialNumber: row.onuSerialNumber,
    onuMacAddress: row.onuMacAddress,
    upstream: row.upstream,
    downstream: row.downstream,
    oltStatus: row.oltStatus,
    oltIp: row.oltIp,
    oltSite: row.site,
    oltInterface: row.oltInterface,
  };

  modalIsVisible.value = true;
};

//* RECENTLY ADDED *//

// Select visible columns options
const columnOptions = ref([
  { value: "id", label: "ID" },
  { value: "subscriberAccountNumber", label: "Acount No." },
  { value: "subscriberName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
  { value: "onuDeviceName", label: "Device Name" },
  { value: "ipAssigned", label: "IP Assigned" },
  { value: "onuSerialNumber", label: "ONU Serial Number" },
  { value: "onuMacAddress", label: "ONU Mac Address" },
  { value: "oltIp", label: "OLT IP" },
  { value: "status", label: "STATUS" },
  { value: "ssidName", label: "SSID" },
]);

// Load saved data from localStorage on component mount
const savedVisibleColumns = localStorage.getItem("visibleColumns");

// Initial displayed columns
const visibleColumns = ref<string[]>(
  savedVisibleColumns
    ? JSON.parse(savedVisibleColumns)
    : [
        "subscriberAccountNumber",
        "subscriberName",
        "packageType",
        "ipAssigned",
        "onuSerialNumber",
        "onuMacAddress",
        "oltIp",
        "site",
        "ssidName",
        "actions",
      ]
);

// Method to display columns when selected in 'Select visible columns'
const handleColumnSelect = (selectedOptions: string[]) => {
  visibleColumns.value = selectedOptions;
  localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
};

// Count total rows (clients) to display in the description
const clientCount = computed(() => rowsHive.value.length);
</script>
