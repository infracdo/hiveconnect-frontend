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
              hint="Search by account number or subscriber name"
            />
          </div>

          <!-- Refresh icon and visible column selection here -->
          <div class="flex flex-row q-gutter-x-md items-center">
            <!-- Refresh icon to reload data -->
            <q-icon
              name="autorenew"
              size="sm"
              class="cursor-pointer"
              @click="handleRefreshTable"
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
              pagination
              :rowsPerPage="10"
              :callback="getProvisionedSubscriberData"
            >
              <template #actions="{ row }">
                <div class="flex justify-center items-center">
                  <q-icon
                    v-if="
                      row.monitoringStatus === 'unmonitored' &&
                      !monitoringRows[row.subscriberAccountNumber]
                    "
                    name="autorenew"
                    size="sm"
                    class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                    @click.stop="
                      handleExecuteMonitoring(row.subscriberAccountNumber)
                    "
                  />

                  <q-spinner-puff
                    v-if="
                      monitoringRows[row.subscriberAccountNumber] ||
                      row.monitoringStatus === 'setting up'
                    "
                    color="primary-600"
                    size="2em"
                  />
                </div>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getHiveSubscribers,
  addFrontendLogger,
  executeMonitoring,
} from "src/api/HiveConnectApis/hiveConnect";
import { useClientStore } from "src/stores/subscriber/client-store";
import { ISubscribers } from "src/api/HiveConnectApis/types";
import { searchRows } from "src/util/search";
import { useKeycloak } from "src/composables/useKeycloak";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";

const router = useRouter();
const route = useRoute();
const keycloak = useKeycloak();
const store = useClientStore();
const columns = computed(
  () => store.$state.subscribercolumns?.filter((col) => col.name !== "id") || [] // Note: subscriber id is not included since we were told that if the id is local (within hive only), it should not be included in the table so i based everything to their account number instead
);
const rowsHive = ref<ISubscribers[]>([]);
const filter = ref("");
const selectedStatus = ref("");
const loading = ref(false);
const monitoringRows = ref<Record<string, boolean>>({}); // To display q-spinner when clicking the action button for executing monitoring

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

// Displayed columns by default
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
  "monitoringStatus",
  "actions",
]);

// Select visible columns options
const columnOptions = ref([
  { value: "subscriberAccountNumber", label: "Account No." },
  { value: "clientName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
  { value: "onuDeviceName", label: "Device Name" },
  { value: "ipAssigned", label: "IP Assigned" },
  { value: "onuSerialNumber", label: "ONU Serial Number" },
  { value: "onuMacAddress", label: "ONU Mac Address" },
  { value: "oltIp", label: "OLT IP" },
  { value: "status", label: "STATUS" },
  { value: "ssidName", label: "SSID" },
  { value: "monitoringStatus", label: "Monitoring Status" },
  { value: "actions", label: "Actions" },
]);

// Method to update the filter value when the user enters something in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

//Method to filter the table based on the selected status in dropdown button
const handleStatusSelect = (status: { label: string; value: string }) => {
  selectedStatus.value = status.value;
};

// Filter rows based on search term or selected status in the dropdown
const filteredRows = computed(() => {
  let filtered = rowsHive.value;

  // If search filter is used
  if (filter.value) {
    filtered = searchRows([...rowsHive.value], filter.value);
  }

  // If select status dropdown button is used
  if (selectedStatus.value) {
    filtered = filtered.filter((row) =>
      row.status.startsWith(selectedStatus.value)
    );
  }

  return filtered;
});

// Method to display columns when selected in 'Select visible columns'
const handleColumnSelect = (selectedOptions: string[]) => {
  if (
    JSON.stringify(visibleColumns.value) !== JSON.stringify(selectedOptions)
  ) {
    visibleColumns.value = selectedOptions;
    // localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
  }
};

// Method for refreshing table data
const handleRefreshTable = async (): Promise<void> => {
  filter.value = "";
  loading.value = true;
  rowsHive.value = [];

  try {
    rowsHive.value = await getHiveSubscribers();
  } catch (error) {
    console.log("Error fetching provisioned subscribers: ", error);
  }

  loading.value = false;
};

// Retrieve provisioned subscriber's data and navigate to the subscriber's details page with auto config and troubleshooting
const getProvisionedSubscriberData = (
  event: Event,
  row: any,
  index: number,
  module: string
) => {
  console.log("Row clicked and navigated to the subscribers details page.");

  router.push({
    name: "provisioned-details",
    params: { accountNo: row.subscriberAccountNumber },
    state: { provisionedSubscriberData: { ...row } },
  });
};

const handleExecuteMonitoring = async (subscriberAccountNumber: string) => {
  try {
    monitoringRows.value[subscriberAccountNumber] = true;
    // isMonitoring.value = true;
    console.log("Executing Monitoring...");
    const response = await executeMonitoring(subscriberAccountNumber);

    if (response.status === "200") {
      // isMonitoring.value = false;
      console.log(
        "Returned response for '/executeMonitoring' API endpoint by action button: ",
        response
      );

      handleRefreshTable();
    }
  } catch (error) {
    // isMonitoring.value = false;
    console.error("Error in execute monitoring by action button: ", error);
    throw error;
  } finally {
    monitoringRows.value[subscriberAccountNumber] = false;
  }
};

// Fetch active/onhold subscribers when component mounts and send a frontend logger for visiting the page
onMounted(async () => {
  // Fetch active/onhold subscribers
  try {
    rowsHive.value = await getHiveSubscribers();
  } catch (error) {
    console.log("Error fetching provisioned subscribers: ", error);
  }

  // Send a user action to backend for visiting the Active/Onhold Subscribers page
  const user = keycloak.tokenParsed.given_name;
  const action = "page visit";
  const details = `${user} visited the ${route.path} page`;
  const page = route.path?.toString() || "Unknown Page";
  const userAgent = navigator.userAgent;

  addFrontendLogger(user, action, details, page, userAgent)
    .then(() => console.log("Frontend log sent successfully."))
    .catch((error) => console.log("Error sending frontend log: ", error));
});
</script>
