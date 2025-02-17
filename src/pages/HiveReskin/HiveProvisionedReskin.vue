<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Provisioned Clients
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }} active subscribers
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
          <div class="full-width p-3">
            <!-- TODO: The 'row-key' in the previous code is 'name'. Re-check this part -->
            <!-- TODO: an ID column is displayed in the table while the said column is not displayed in the current Hive.
             re-check this part and make sure the ID matches with the database and are not auto-generated for UI purposes -->
            <!-- TODO: add actions button -->
            <Table
              :tableColumns="provisionedClientColumns"
              :tableRows="provisionedClientRows"
              :visibleColumns="visibleColumns"
              :rowsPerPage="10"
              @rowClick="openModal"
            >
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

    <!-- Display troubleshoot modal when row is clicked-->
    <Modal
      :isVisible="modalIsVisible"
      :title="'Troubleshoot Client'"
      @update:isVisible="modalIsVisible = $event"
      :actionHandler="handleTroubleshootClient"
      showSaveButton
    >
      <!-- Client details section-->
      <div class="mb-4">
        <p class="mb-2 text-gray-iron-900 font-semibold">Client Details</p>
        <div class="mb-4" style="display: flex; gap: 16px">
          <!-- Client Name input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.subscriberName"
            label="Client Name"
            @input="noLeadingWhitespace"
            required
          />

          <!-- Account Number input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.accountNo"
            label="Account Number"
            @input="noLeadingWhitespace"
            required
          />

          <!-- Package Type input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.packageType"
            label="Package Type"
            @input="noLeadingWhitespace"
            required
          />
        </div>
      </div>

      <!-- ONU Details Section -->
      <div class="mb-4">
        <div class="mb-2 text-gray-iron-900 font-semibold">ONU Details</div>
        <div class="mb-2" style="display: flex; gap: 16px">
          <!-- ONU Status input field-->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.onuStatus"
            label="ONU Status"
            readonly
          />

          <!-- ONU IP input field-->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.onuIp"
            label="ONU IP"
            @input="noLeadingWhitespace"
            required
          />

          <!-- ONU Serial Number select field -->
          <Selects
            v-model="client.onuSerialNumber"
            label="ONU Serial Number"
            :options="[
              { label: 'SN-9876543210', value: 'SN-98765432101' },
              { label: 'SN-1234567890', value: 'SN-1234567890' },
              { label: 'SN-1122334455', value: 'SN-1122334455' },
              { label: 'SN-5566778899', value: 'SN-5566778899' },
              { label: 'SN-6677889901', value: 'SN-6677889901' },
            ]"
            required
          />
        </div>
        <div class="mb-2" style="display: flex; gap: 16px">
          <!-- ONU Mac Address input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.onuMacAddress"
            label="ONU Mac Address"
            @input="noLeadingWhitespace"
            required
          />

          <!-- Upstream input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.upstream"
            label="Upstream"
            readonly
            required
          />

          <!-- Downstream input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.downstream"
            label="Downstream"
            readonly
            required
          />
        </div>
      </div>

      <!-- OLT Details Section-->
      <div class="mb-4">
        <div class="mb-2 text-gray-iron-900 font-semibold">OLT Details</div>
        <div class="mb-2" style="display: flex; gap: 16px">
          <!-- OLT Status input field -->
          <Inputs
            :input-style="{ 'text-transform': 'uppercase' }"
            v-model="client.oltStatus"
            label="OLT Status"
            readonly
            required
          />

          <!-- OLT IP input field -->
          <Selects
            v-model="client.oltIp"
            label="OLT IP"
            :options="[
              { label: '192.168.10.1', value: '192.168.10.1' },
              { label: '10.0.1.1', value: '10.0.1.1' },
              { label: '172.16.50.1', value: '172.16.50.1' },
              { label: '192.168.20.1', value: '192.168.20.1' },
              { label: '10.10.10.2', value: '10.10.10.2' },
            ]"
            required
          />

          <!-- OLT Site select field -->
          <Selects
            v-model="client.oltSite"
            label="OLT Site"
            :options="[
              { label: 'CDO', value: 'CDO' },
              { label: 'Malaybalay', value: 'Malaybalay' },
              { label: 'Davao', value: 'Davao' },
              { label: 'Makati', value: 'Makati' },
            ]"
            required
          />

          <!-- OLT Interface select field -->
          <Selects
            v-model="client.oltInterface"
            label="OLT Interface"
            :options="[
              { label: 'eth0', value: 'eth0' },
              { label: 'eth1', value: 'eth1' },
              { label: 'pon0', value: 'pon0' },
              { label: 'pon1', value: 'pon1' },
              { label: 'gige0', value: 'gige0' },
            ]"
          />
        </div>
      </div>
    </Modal>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getHiveClients } from "src/api/HiveConnectApis/hiveConnect";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
import { IClient } from "src/api/HiveConnectApis/types";
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

const store = useSubscriberStore();
// Recently updated: null array is passed if the data is undefined
// TODO: re-check this part if something's wrong or if there is another way
const columns = store.$state.subscribercolumns || [];
const rowsHive = ref<IClient[]>([]);
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
  rowsHive.value = await getHiveClients();
  loading.value = false;
};

// ============================================================================

// RECENTLY ADDED!!!

// Function to update the filter value when the user enters something in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

// Filtered rows based on search term
// const filteredRows = computed(() => {
//   if (!filter.value) return provisionedClientRows.value;

//   const searchTerm = filter.value.toLowerCase();
//   return provisionedClientRows.value.filter((row) => {
//     return (
//       row.id.toString().toLowerCase().includes(searchTerm) ||
//       row.subscriberName.toString().toLowerCase().includes(searchTerm) ||
//       row.accountNo.toString().toLowerCase().includes(searchTerm) ||
//       row.packageType.toString().toLowerCase().includes(searchTerm) ||
//       row.onuSerialNumber.toString().toLowerCase().includes(searchTerm) ||
//       row.onuMacAddress.toString().toLowerCase().includes(searchTerm) ||
//       row.oltIp.toString().toLowerCase().includes(searchTerm) ||
//       row.deviceName.toString().toLowerCase().includes(searchTerm) ||
//       row.ipAssigned.toString().toLowerCase().includes(searchTerm)
//     );
//   });
// });

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
    subscriberName: row.subscriberName,
    accountNo: row.accountNo,
    packageType: row.packageType,
    onuStatus: row.onuStatus,
    onuIp: row.onuIp,
    onuSerialNumber: row.onuSerialNumber,
    onuMacAddress: row.onuMacAddress,
    upstream: row.upstream,
    downstream: row.downstream,
    oltStatus: row.oltStatus,
    oltIp: row.oltIp,
    oltSite: row.oltSite,
    oltInterface: row.oltInterface,
  };

  modalIsVisible.value = true;
};

// Method to trigger form troubleshoot button in modal
const handleTroubleshootClient = () => {
  try {
    Swal.fire({
      title: "Success",
      text: "Client troubleshooted successfully",
      icon: "success",
      confirmButtonColor: "#1d6499",
      confirmButtonText: "Confirm",
      allowOutsideClick: false,
    });

    client.value = {
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
    };

    modalIsVisible.value = false;
  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: "Error troubleshooting client",
      icon: "error",
      confirmButtonColor: "#fd0808",
    });
  }
};

// Define inputValue
const inputValue = ref("");
// Method to remove leading whitespace in input during typing
const noLeadingWhitespace = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/^\s+/, "");
  inputValue.value = input.value;
};

// Recently added
const columnOptions = ref([
  { value: "id", label: "ID" },
  { value: "accountNo", label: "Acount No." },
  { value: "subscriberName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
  { value: "deviceName", label: "Device Name" },
  { value: "ipAssigned", label: "IP Assigned" },
  { value: "onuSerialNumber", label: "ONU Serial Number" },
  { value: "onuMacAddress", label: "ONU Mac Address" },
  { value: "oltIp", label: "OLT IP" },
  { value: "ssid", label: "SSID" },
  { value: "actions", label: "Actions" },
]);

// Load saved data from localStorage on component mount
const savedVisibleColumns = localStorage.getItem("visibleColumns");
const visibleColumns = ref<string[]>(
  savedVisibleColumns
    ? JSON.parse(savedVisibleColumns)
    : [
        "id",
        "accountNo",
        "subscriberName",
        "packageType",
        "deviceName",
        "ipAssigned",
        "onuSerialNumber",
        "onuMacAddress",
        "oltIp",
        "ssid",
        "actions",
      ]
);

const handleColumnSelect = (selectedOptions: string[]) => {
  visibleColumns.value = selectedOptions;
  localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
};

// Count total rows (clients) to display in the description
const clientCount = computed(() => rowsHive.value.length);

// Sample hardcoded columns and rows for testing purposes
const provisionedClientColumns = ref([
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
    name: "deviceName",
    align: "left",
    label: "Device Name",
    field: "deviceName",
  },
  {
    name: "ipAssigned",
    align: "left",
    label: "IP Assigned",
    field: "ipAssigned",
  },
  {
    name: "onuSerialNumber",
    align: "left",
    label: "ONU Serial Number",
    field: "onuSerialNumber",
  },
  {
    name: "onuMacAddress",
    align: "left",
    label: "ONU Mac Address",
    field: "onuMacAddress",
  },
  {
    name: "oltIp",
    align: "left",
    label: "OLT IP",
    field: "oltIp",
  },
  {
    name: "ssid",
    align: "left",
    label: "SSID",
    field: "ssid",
  },
  {
    name: "actions",
    align: "left",
    label: "Actions",
    field: "actions",
  },
]);

const provisionedClientRows = ref([
  {
    id: "1",
    accountNo: "RES-202402-15",
    subscriberName: "JANE DOE",
    packageType: "PLAN999",
    deviceName: "Mikrotik",
    ipAssigned: "192.168.90.151",
    onuSerialNumber: "112321441",
    onuMacAddress: "32j323j",
    oltIp: "192.168.90.151",
    ssid: "jane-doe-wifi",
    actions: "test",
  },
  {
    id: "1",
    accountNo: "RES-202402-15",
    subscriberName: "JANE DOE",
    packageType: "PLAN999",
    deviceName: "Mikrotik",
    ipAssigned: "192.168.90.151",
    onuSerialNumber: "112321441",
    onuMacAddress: "32j323j",
    oltIp: "192.168.90.151",
    ssid: "jane-doe-wifi",
    actions: "test",
  },
  {
    id: "1",
    accountNo: "RES-202402-15",
    subscriberName: "JANE DOE",
    packageType: "PLAN999",
    deviceName: "Mikrotik",
    ipAssigned: "192.168.90.151",
    onuSerialNumber: "112321441",
    onuMacAddress: "32j323j",
    oltIp: "192.168.90.151",
    ssid: "jane-doe-wifi",
    actions: "test",
  },
  {
    id: "2",
    accountNo: "RES-202402-16",
    subscriberName: "JOHN SMITH",
    packageType: "PLAN599",
    deviceName: "TP-Link",
    ipAssigned: "192.168.90.152",
    onuSerialNumber: "112321442",
    onuMacAddress: "32j323k",
    oltIp: "192.168.90.152",
    ssid: "john-smith-wifi",
    actions: "activate",
  },
  {
    id: "3",
    accountNo: "RES-202402-17",
    subscriberName: "ALICE BROWN",
    packageType: "PLAN1299",
    deviceName: "Netgear",
    ipAssigned: "192.168.90.153",
    onuSerialNumber: "112321443",
    onuMacAddress: "32j323l",
    oltIp: "192.168.90.153",
    ssid: "alice-brown-wifi",
    actions: "test",
  },
  {
    id: "4",
    accountNo: "RES-202402-18",
    subscriberName: "CHARLIE WILSON",
    packageType: "PLAN1999",
    deviceName: "Mikrotik",
    ipAssigned: "192.168.90.154",
    onuSerialNumber: "112321444",
    onuMacAddress: "32j323m",
    oltIp: "192.168.90.154",
    ssid: "charlie-wilson-wifi",
    actions: "deactivate",
  },
  {
    id: "5",
    accountNo: "RES-202402-19",
    subscriberName: "EMILY DAVIS",
    packageType: "PLAN1499",
    deviceName: "D-Link",
    ipAssigned: "192.168.90.155",
    onuSerialNumber: "112321445",
    onuMacAddress: "32j323n",
    oltIp: "192.168.90.155",
    ssid: "emily-davis-wifi",
    actions: "test",
  },
]);
</script>
