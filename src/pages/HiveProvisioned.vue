<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Active/Onhold Subscribers
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }} active/onhold
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

            <DropdownButton
              @select="handleStatusSelect"
              :columnOptions="statusOptions"
              :selectedOptions="selectedStatus"
              label="Select Status"
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
              :tableColumns="
                columns.filter((col) => visibleColumns.includes(col.name))
              "
              :tableRows="filteredRows"
              :visibleColumns="visibleColumns"
              :rowsPerPage="10"
              @rowClick="openModal"
            >
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
// import { useRoute } from "vue-router";
import { getHiveClients } from "src/api/HiveConnectApis/hiveConnect";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
import { useClientStore } from "src/stores/subscriber/client-store";
import { IClient } from "src/api/HiveConnectApis/types";
import { searchRows } from "src/util/search";
import TroubleshootClient from "src/components/InetConfig/TroubleshootClient.vue";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";

// const route = useRoute();
const store = useClientStore();
const columns = computed(
  () => store.$state.subscribercolumns?.filter((col) => col.name !== "id") || [] // Note: subscriber id is not included since we were told that if the id is local (within hive only), it should not be included in the table so i based everything to their account number instead
);
const rowsHive = ref<IClient[]>([]);
const deviceName = ref("");
const filter = ref("");
const selectedStatus = ref("");
const clientId = ref(0);
const openTroubleShootModal = ref(false);
const loading = ref(false);
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

// Store visible columns' state differently for each pagey using storageKey
// const storageKey = `visibleColumns-${route.path}`;

// When user checks/unchecks an option in the 'Select visible columns' dropdown, it will then save the current state at that point in the local storage
// --- the moment that state is stored in the local storage, it will always display that column/s even if the page reloads or you navigate to another page
// --- unless you change the current state (select/deselect an option)
// const savedVisibleColumns = localStorage.getItem(storageKey);

// Count total rows (clients) to display in the description
const clientCount = computed(() => rowsHive.value.length || 0);

// Options for select status dropdown button
const statusOptions = ref([
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Onhold", value: "ONHOLD" },
]);

// Initial displayed columns
const visibleColumns = ref([
  "subscriberAccountNumber",
  "clientName",
  "packageType",
  "onuDeviceName",
  "ipAssigned",
  "onuSerialNumber",
  "onuMacAddress",
  "oltIp",
  "status",
  "ssidName",
]);

// Select visible columns options
const columnOptions = ref([
  { value: "subscriberAccountNumber", label: "Acount No." },
  { value: "clientName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
  { value: "onuDeviceName", label: "Device Name" },
  { value: "ipAssigned", label: "IP Assigned" },
  { value: "onuSerialNumber", label: "ONU Serial Number" },
  { value: "onuMacAddress", label: "ONU Mac Address" },
  { value: "oltIp", label: "OLT IP" },
  { value: "status", label: "STATUS" },
  { value: "ssidName", label: "SSID" },
]);

// Filter rows based on search term or selected status in the dropdown
const filteredRows = computed(() => {
  let filtered = rowsHive.value;

  if (filter.value) {
    searchRows([...rowsHive.value], filter.value);
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((row) =>
      row.status.startsWith(selectedStatus.value)
    );
  }

  return filtered;
});

// Function to update the filter value when the user enters something in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

const handleStatusSelect = (status: { label: string; value: string }) => {
  selectedStatus.value = status.value;
};

// Method to display columns when selected in 'Select visible columns'
const handleColumnSelect = (selectedOptions: string[]) => {
  if (
    JSON.stringify(visibleColumns.value) !== JSON.stringify(selectedOptions)
  ) {
    visibleColumns.value = selectedOptions;
    // localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
  }
};

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

// Method to open the troubleshoot modal
// NOTE: i still haven't seen this modal in action since there are issues while opening this modal
const openTroubleshootModal = (
  onuDeviceName: string,
  newSubscriberId: number
) => {
  deviceName.value = onuDeviceName;
  console.log(typeof newSubscriberId, " id value is ", newSubscriberId);
  clientId.value = newSubscriberId;
  openTroubleShootModal.value = !openTroubleShootModal.value;
};

// Method to close the troubleshoot modal
// NOTE: i still haven't seen this modal in action since there are issues while opening this modal
const closeTroubleShootModal = () => {
  openTroubleShootModal.value = !openTroubleShootModal.value;
};

// Method to fetch the provisioned subscribers data through API
const getProvisioned = async (): Promise<void> => {
  filter.value = "";
  loading.value = true;
  rowsHive.value = [];
  try {
    rowsHive.value = await getHiveClients();
  } catch (error) {}
  loading.value = false;
};

onMounted(async () => {
  await getProvisioned();
});
</script>
