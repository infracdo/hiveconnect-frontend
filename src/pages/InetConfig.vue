<!-- eslint-disable camelcase -->
<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headings here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            New Subscriber Provision
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }} for provision
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
          <div class="full-width">
            <Table
              :tableColumns="columns"
              :tableRows="filteredRows"
              :visibleColumns="visibleColumns"
              :rowsPerPage="10"
              @rowClick="openModal"
            >
              <!-- Actions column provision action button-->
              <template #actions="{ row }">
                <q-icon
                  name="assignment"
                  size="sm"
                  class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                  @click="openModal(row.newSubscriberId)"
                />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Display modal when a row (client data) is clicked -->
    <Modal
      :isVisible="modalOpen"
      :title="'Provision Subscriber'"
      :submitButton="'Activate'"
      @update:isVisible="modalOpen = $event"
      :actionHandler="handleActivateClient"
    >
      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Account number input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="client.subscriberAccountNumber"
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
          v-model="selectedOnuSerialNumber"
          label="ONU Serial Number"
          :options="
            serialAndMac.map((device) => ({
              value: device.serial_number,
              label: device.serial_number,
            }))
          "
          optionLabel="label"
          optionValue="value"
          required
        />

        <!-- ONU mac address input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="onuMacAddress"
          label="ONU Mac Address"
          @input="noLeadingWhitespace"
          readonly
          required
        />
      </div>

      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Location select field -->
        <Selects
          v-model="selectedLocation"
          label="Select Location"
          :options="locations"
          optionLabel="label"
          optionValue="value"
          required
          class="w-full"
        />
      </div>

      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Network site (vlan) select field -->
        <Selects
          v-model="selectedNetworkSiteValue"
          label="Select Network Site (VLAN)"
          :options="
            filteredNetworkSites.map((site) => ({
              value: site.oltIps?.[0]?.newOltId || 0,
              label: site.oltNetworksite,
            }))
          "
          optionLabel="label"
          optionValue="value"
          emit-value
          map-options
          required
        />

        <!-- OLT ip select field -->
        <Selects
          v-if="selectedNetworkSite && selectedNetworkSite.oltIps"
          v-model="client.oltIp"
          label="Select OLT IP"
          :options="
            selectedNetworkSite.oltIps.map((olt) => ({
              value: olt.oltIp,
              label: olt.oltName,
            }))
          "
          optionLabel="label"
          optionValue="value"
          required
        />
      </div>

      <!-- Provision Client -->
      <ProvisionClient
        :isVisible="modalProvisionChecking"
        @update:isVisible="modalProvisionChecking = $event"
        :responses="responses"
        :responseStatus="responseStatus"
        :showProvisionResult="showProvisionResult"
        :ssid="ssid"
      />
    </Modal>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from "quasar";
import { ref, watchEffect, watch, onMounted, computed, reactive } from "vue";
import Swal from "sweetalert2";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
import {
  getClients,
  getClientById,
  getDevices,
  checkPackageDetails,
  getNetworkSiteOltIp,
  preProvisionCheck,
  executeAutoConfig,
  executeMonitoring,
} from "src/api/HiveConnectApis/hiveConnect";
import {
  IClient,
  IOltSiteByIp,
  GroupedNetworkSite,
  IOlt,
} from "src/api/HiveConnectApis/types";
import { searchRows } from "src/util/search";
import { IserialAndMac, IsubsriberType } from "src/components/models";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";
import Modal from "src/components/Modal.vue";
import Inputs from "src/components/inputs/Inputs.vue";
import Selects from "src/components/inputs/Selects.vue";
import ProvisionClient from "src/components/InetConfig/ProvisionClient.vue";

const $q = useQuasar();
const store = useSubscriberStore();
const columns: QTableProps["columns"] = store.$state.subscribercolumns?.length
  ? store.$state.subscribercolumns
  : [];
const rows = ref<IClient[]>([]);
const dataId = ref<string>();
const filter = ref("");
const result = ref("");
const modalOpen = ref(false);
const inputValue = ref("");
const deviceName = ref("");
const clientId = ref(0);
const loading = ref(false);
const modalProvisionChecking = ref(false);
let serialAndMac: IserialAndMac[] = [];
const selectedOnuSerialNumber = ref("");
const onuMacAddress = ref("");
const optionsOltIp = ref<IOlt[]>([]);
const filteredOptions = ref<IOlt[]>([]);
const selectedNetworkSiteValue = ref<number>(0);
const networkSites = ref<IOltSite[]>([]);
const selectedNetworkSite = ref<IOltSite | null>(null);
const filteredNetworkSites = ref<IOltSite[]>([]); // List of sites filtered by selected location
const selectedOltIp = ref(null);
const networkSiteOltIp = ref<IOltSiteByIp[]>([]);
const selectedLocation = ref("");
const showProvisionResult = ref(false);
const showSkeletonDancing = ref(false);

interface IOltSite {
  oltNetworksite: string;
  oltIps: {
    id: number;
    oltIp: string;
    oltName: string;
    newOltId: number;
  }[];
}

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

const NewClient = reactive({
  bucketId: "",
  clientId: "",
  accountNumber: "",
  packageType: "",
  oltReportedUpstream: 0,
  oltReportedDownstream: 0,
  serialAndMac: {
    serialNum: "",
    macAddress: "",
  },
  oltIp: "",
  newOltId: 0,
  clientName: "",
});

const ssid = reactive({
  name: "",
  pw: "",
});

const responses = reactive({
  autoConfig: "",
  monitoring: "",
  provisionCheck: "",
});

const responseStatus = reactive({
  autoConfig: false,
  monitoring: false,
  provisionCheck: false,
});

// When user checks/unchecks an option in the 'Select visible columns' dropdown, it will then save the current state at that point in the local storage
// --- the moment that state is stored in the local storage, it will always display that column/s even if the page reloads or you navigate to another page
// --- unless you change the current state (select/deselect an option)
const savedVisibleColumns = localStorage.getItem("visibleColumns");

// Initial displayed columns
const visibleColumns = ref<string[]>(
  savedVisibleColumns
    ? JSON.parse(savedVisibleColumns)
    : [
        "newSubscriberId",
        "subscriberAccountNumber",
        "subscriberName",
        "packageType",
        "actions",
      ]
);

// Options for selecting visible columns
const columnOptions = ref([
  { value: "newSubscriberId", label: "Subscriber ID" },
  { value: "subscriberAccountNumber", label: "Account Number" },
  { value: "subscriberName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
]);

// Define values that is equivalent to the database data for mapping
// NOTE: add objects in case there are new stored data in database for 'olt_network_site' column
// NOTE: remove this if a 'location' values can now be retrieved from the database
const getFullLocationName = (key: string): string => {
  const mapping: { [key: string]: string } = {
    MBY: "MALAYBALAY",
    CDO: "CDO",
    DVO: "DAVAO",
    BTN: "BUTUAN",
  };
  return mapping[key] || key;
};

// Define select location options as object
const locations = ref([
  { label: "UAT", value: "UAT" },
  { label: "CDO", value: "CDO" },
  { label: "MALAYBALAY", value: "MBY" },
  { label: "DAVAO", value: "DAVAO" },
  { label: "BUTUAN", value: "BUTUAN" },
  { label: "DIGOS", value: "DIGOS" },
  { label: "GENSAN", value: "GENSAN" },
  { label: "TAGUM", value: "TAGUM" },
  { label: "CEBU", value: "CEBU" },
  { label: "KORONADAL", value: "KORONADAL" },
  { label: "SANTIAGO", value: "SANTIAGO" },
  { label: "SANTO TOMAS", value: "SANTO TOMAS" },
  { label: "VALENCIA", value: "VALENCIA" },
  { label: "PAGADIAN", value: "PAGADIAN" },
  { label: "ILIGAN", value: "ILIGAN" },
  { label: "PANABO", value: "PANABO" },
  { label: "SAN FRANZ", value: "SAN FRANZ" },
  { label: "BISLIG", value: "BISLIG" },
  { label: "TANDAG", value: "TANDAG" },
  { label: "TACLOBAN", value: "TACLOBAN" },
]);

// Count total number of rows (clients) to display it in the description
const clientCount = computed(() => rows.value.length || 0);

// Method to remove leading whitespace in inputs during typing
const noLeadingWhitespace = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/^\s+/, "");
  inputValue.value = input.value;
};

// Filter rows based on search term
const filteredRows = computed(() => {
  return searchRows([...rows.value], filter.value);
});

// Function to update the filter value when the user types in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

const handleColumnSelect = (selectedOptions: string[]) => {
  if (
    JSON.stringify(visibleColumns.value) !== JSON.stringify(selectedOptions)
  ) {
    visibleColumns.value = selectedOptions;
    localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
  }
};

const openModal = async (newSubscriberId: number) => {
  // $q.loading.show();
  const rogueDevice = await getDevices();

  serialAndMac = rogueDevice.map(
    (device: { serial_number: string; mac_address: string }) => ({
      serial_number: device.serial_number,
      mac_address: device.mac_address,
    })
  );

  client.value = await getClientById(newSubscriberId);
  console.log(client.value);
  modalOpen.value = true;
  // $q.loading.hide();
};

const closeModal = () => {
  modalOpen.value = !modalOpen.value;
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

// const openProvisionModal = async (event: any) => {
//   // $q.loading.show();

//   modalProvisionChecking.value = true;
//   // $q.loading.hide();
// };

const getAllClients = async () => {
  try {
    await refreshTable();
  } catch (error) {
    throw new Error("Cannot get Clients info.");
  }
};

// Filter the network sites according to the location selected by user in the modal form
// Returns a list of network sites in 'Select Network Site (VLAN)' select field if OLT network site matches the selected location
const filterNetworkSites = () => {
  console.log("Filtering network sites by location:", selectedLocation.value);
  console.log("Original network sites:", networkSites.value);

  // Get the full location name from the location mapping
  const fullLocationName = getFullLocationName(selectedLocation.value);

  // Check if the selected location is empty or the default option
  if (fullLocationName === "" || fullLocationName === "Select Location") {
    filteredNetworkSites.value = networkSites.value; // Return all sites if no valid selection
  } else {
    // Filter the network sites based on the selected location
    filteredNetworkSites.value = networkSites.value.filter((site) => {
      // Determine if the site matches the selected location
      const matches = site.oltNetworksite
        .toLowerCase()
        .includes(selectedLocation.value.toLowerCase());

      // Log the site being checked and whether it matches
      console.log(`Checking site: ${site.oltNetworksite}, matches: ${matches}`);

      // Return true if there's a match
      return matches;
    });
  }

  // Log the filtered network sites after processing
  console.log("Filtered network sites:", filteredNetworkSites.value);
};

// Group OLT according to their OLT Network Site
// Creates and returns an array oy OLT Networki Sites (e.g. CDO_vlan2010)
const transformData = async () => {
  console.log("Fetching OLT IP data...");
  networkSiteOltIp.value = await getNetworkSiteOltIp();

  console.log("Fetched data:", networkSiteOltIp.value);

  const groupedData = networkSiteOltIp.value.reduce((accumulatedOlt, data) => {
    console.log("Processing data:", data);

    // @ts-ignore
    const existingSite = accumulatedOlt.find(
      (siteName) => siteName?.oltNetworksite === data?.oltNetworksite
    );

    if (existingSite) {
      console.log("Existing site found:", existingSite.oltNetworksite);
      // Create and merge object into one if repeated oltName
      // @ts-ignore
      existingSite.oltIps.push({
        // @ts-ignore
        id: existingSite.oltIps.length + 1,
        oltIp: data.oltIp,
        oltName: data.oltName,
        newOltId: data.newOltId,
      });
      console.log(
        "Updated existing site with new OLT IP:",
        existingSite.oltIps
      );
    } else {
      console.log("New site created for:", data.oltNetworksite);
      // @ts-ignore
      accumulatedOlt.push({
        oltNetworksite: data.oltNetworksite,
        oltIps: [
          {
            id: 1,
            oltIp: data.oltIp,
            oltName: data.oltName,
            newOltId: data.newOltId,
          },
        ],
      });
    }

    // Return new object
    return accumulatedOlt;
  }, [] as IOltSite[]);

  networkSites.value = groupedData;
  console.log("Grouped data:", groupedData);

  // Initial setting of filteredNetworkSites
  filteredNetworkSites.value = networkSites.value;
  console.log("networkSites:", networkSites.value);
};

const provisionClient = async (clientData: typeof NewClient): Promise<void> => {
  // $q.loading.show();
  showSkeletonDancing.value = true;
  showProvisionResult.value = false;

  console.log("NewClient Data in provisionClient:", NewClient);

  responses.autoConfig = "";
  responses.monitoring = "";

  try {
    responses.provisionCheck = "Preprovision checking ...";
    const response = await preProvisionCheck(
      //send values to /preprovisionCheck API
      clientData.accountNumber,
      clientData.clientName,
      clientData.serialAndMac.serialNum,
      clientData.serialAndMac.macAddress,
      clientData.oltIp,
      clientData.packageType,
      clientData.newOltId
    );
    responses.provisionCheck = response.message;
    responseStatus.provisionCheck = true;
  } catch (error: any) {
    responses.provisionCheck = error.response.data.message;
    return stopProvisionFunction();
  }

  try {
    responses.autoConfig = "Executing Auto Config...";
    const response = await executeAutoConfig(
      clientData.accountNumber,
      clientData.clientName,
      clientData.serialAndMac.serialNum,
      clientData.serialAndMac.macAddress,
      clientData.oltIp,
      clientData.packageType,
      clientData.newOltId
      // clientData.oltReportedDownstream,
      // clientData.oltReportedUpstream
    );
    if (response) {
      responses.autoConfig = response.message;
      ssid.name = response.ssid_name;
      ssid.pw = response.ssid_pw;
      responseStatus.autoConfig = true;
    }
  } catch (error: any) {
    if (error.response.data.message !== "") {
      responses.autoConfig = error.response.data.message;
    } else {
      responses.autoConfig = "Something went wrong!";
    }
    return stopProvisionFunction();
  }

  try {
    responses.monitoring = "Executing Monitoring...";
    const response = await executeMonitoring(
      clientData.accountNumber,
      clientData.clientName,
      clientData.serialAndMac.serialNum,
      clientData.serialAndMac.macAddress,
      clientData.oltIp,
      clientData.packageType,
      clientData.newOltId
      // clientData.oltReportedDownstream,
      // clientData.oltReportedUpstream
    );
    if (response) {
      responses.monitoring = response.message;
      responseStatus.monitoring = true;
    }
  } catch (error: any) {
    if (error.response.data.message !== "") {
      responses.monitoring = error.response.data.message;
    } else {
      responses.monitoring = "Something went wrong!";
    }
    return stopProvisionFunction();
  }

  stopProvisionFunction();
  showProvisionResult.value = true;
};

// Stop client provision
const stopProvisionFunction = () => {
  showSkeletonDancing.value = false;
  // $q.loading.hide();
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
    Object.assign(NewClient, {
      bucketId: client.value.bucketId,
      clientId: client.value.newSubscriberId,
      accountNumber: client.value.subscriberAccountNumber,
      packageType: client.value.packageType,
      oltReportedUpstream: client.value.oltReportedUpstream,
      oltReportedDownstream: client.value.oltReportedDownstream,
      serialAndMac: {
        serialNum: selectedOnuSerialNumber.value,
        macAddress: onuMacAddress.value,
      },
      oltIp: client.value.oltIp,
      newOltId: selectedNetworkSiteValue.value,
      clientName: client.value.subscriberName,
    });

    modalProvisionChecking.value = true;
    await provisionClient(NewClient);
  }
};

watch(
  () => client.oltIp,
  (newOltIp) => {
    if (newOltIp && selectedNetworkSite.value) {
      // Find the corresponding newOltId based on selected OLT IP
      const selectedOlt = selectedNetworkSite.value.oltIps.find(
        (olt) => olt.oltIp === newOltIp
      );
      client.value.newOltId = selectedOlt ? selectedOlt.newOltId : null;
      console.log("newOltId after oltIp selection:", client.value.newOltId);
    }
  }
);

// Watch for selected ONU serial number and assign mac address
watch(selectedOnuSerialNumber, (newSerialNumber) => {
  const device = serialAndMac.find(
    (device) => device.serial_number === newSerialNumber
  );
  if (device) {
    onuMacAddress.value = device.mac_address;
  }
});

// Watch for changes to selectedLocation and apply filtering
watch(selectedLocation, (newValue) => {
  filterNetworkSites();
});

watch(selectedNetworkSiteValue, (newValue) => {
  const selectedSite = filteredNetworkSites.value.find(
    (site) => site.oltIps?.[0]?.newOltId === newValue
  );
  selectedNetworkSite.value = selectedSite || null;
});

onMounted(getAllClients);

onMounted(async () => {
  console.log("onMounted triggered, starting data transformation...");

  try {
    await transformData();
    console.log("Data transformation completed.");
  } catch (error) {
    console.error("Error during data transformation:", error);
  }
});
</script>
