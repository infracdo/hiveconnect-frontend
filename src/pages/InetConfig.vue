<!-- eslint-disable camelcase -->
<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headings here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Subscribers for Provisioning
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }}
            {{ clientCount < 2 ? "subscriber" : "subscribers" }}
            for provisioning
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
          <!-- Table for NEW status subscribers (to be provision) -->
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

    <!-- Display modal when a row (subscriber data) is clicked -->
    <Modal
      :isVisible="modalOpen"
      :title="'Provision Subscriber'"
      :submitButton="'Activate'"
      @update:isVisible="modalOpen = $event"
      @cancel="resetForm"
      :actionHandler="handleActivateClient"
    >
      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Account number input field -->
        <Inputs
          v-model="client.subscriberAccountNumber"
          label="Account Number"
          @input="noLeadingWhitespace"
          readonly
          required
        />

        <!-- Client name input field -->
        <Inputs
          v-model="client.subscriberName"
          label="Subscriber Name"
          @input="noLeadingWhitespace"
          readonly
          required
        />

        <!-- Package type input field -->
        <Inputs
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
          :disabled="!selectedLocation"
          emit-value
          map-options
          required
        />

        <!-- OLT ip select field -->
        <Selects
          v-model="client.oltIp"
          label="Select OLT IP"
          :options="
            selectedNetworkSite?.oltIps?.map((olt) => ({
              value: olt.oltIp,
              label: olt.oltName,
            })) || []
          "
          optionLabel="label"
          optionValue="value"
          :disabled="!selectedNetworkSiteValue"
          required
        />
      </div>
    </Modal>

    <!-- Provision Client -->
    <ProvisionClient
      :isVisible="modalProvisionClientResponse"
      @update:isVisible="modalProvisionClientResponse = $event"
      :responses="responses"
      :responseStatus="responseStatus"
      :showProvisionResult="showProvisionResult"
      :ssid="ssid"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from "quasar";
import { ref, watchEffect, watch, onMounted, computed, reactive } from "vue";
import { useRoute } from "vue-router";
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
  addFrontendLogger,
} from "src/api/HiveConnectApis/hiveConnect";
import {
  IClient,
  IOltSiteByIp,
  GroupedNetworkSite,
  IOlt,
} from "src/api/HiveConnectApis/types";
import { searchRows } from "src/util/search";
import { IserialAndMac, IsubsriberType } from "src/components/models";
import { useKeycloak } from "src/composables/useKeycloak";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";
import Modal from "src/components/Modal.vue";
import Inputs from "src/components/inputs/Inputs.vue";
import Selects from "src/components/inputs/Selects.vue";
import ProvisionClient from "src/components/InetConfig/ProvisionClient.vue";

// Constants and Initialization
// const $q = useQuasar();
const route = useRoute();
const keycloak = useKeycloak();
const store = useSubscriberStore();
const columns: QTableProps["columns"] = store.$state.subscribercolumns?.length
  ? store.$state.subscribercolumns
  : [];
const rows = ref<IClient[]>([]);
let serialAndMac: IserialAndMac[] = [];
// const optionsOltIp = ref<IOlt[]>([]);
// const filteredOptions = ref<IOlt[]>([]);
const networkSites = ref<IOltSite[]>([]);
const selectedNetworkSite = ref<IOltSite | null>(null);
const filteredNetworkSites = ref<IOltSite[]>([]); // List of sites filtered by selected location
const networkSiteOltIp = ref<IOltSiteByIp[]>([]);
// const dataId = ref<string>();
const selectedNetworkSiteValue = ref<number>(0);
// const clientId = ref(0);
const filter = ref("");
// const result = ref("");
const inputValue = ref("");
// const deviceName = ref("");
const selectedOnuSerialNumber = ref("");
const onuMacAddress = ref("");
const selectedLocation = ref("");
const selectedOltIp = ref(null);
const modalOpen = ref(false);
const loading = ref(false);
const modalProvisionClientResponse = ref(false);
const showProvisionResult = ref(false);
const showSkeletonDancing = ref(false);

// Reactive State
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
  bucketId: 0,
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

const responses = reactive({
  // provisionCheck: "",
  autoConfig: "",
  // monitoring: "",
});

const responseStatus = reactive({
  // provisionCheck: false,
  autoConfig: false,
  // monitoring: false,
});

const ssid = reactive({
  name: "",
  pw: "",
});

// Store visible columns' state differently for each pagey using storageKey
// const storageKey = `visibleColumns-${route.path}`;

// When user checks/unchecks an option in the 'Select visible columns' dropdown, it will then save the current state at that point in the local storage
// --- the moment that state is stored in the local storage, it will always display that column/s even if the page reloads or you navigate to another page
// --- unless you change the current state (select/deselect an option)
// const savedVisibleColumns = localStorage.getItem(storageKey);

// Initial displayed columns
const visibleColumns = ref([
  "newSubscriberId",
  "subscriberAccountNumber",
  "subscriberName",
  "packageType",
  "actions",
]);

// Options for selecting visible columns
const columnOptions = ref([
  { value: "newSubscriberId", label: "Subscriber ID" },
  { value: "subscriberAccountNumber", label: "Account Number" },
  { value: "subscriberName", label: "Subscriber Name" },
  { value: "packageType", label: "Package Type" },
  { value: "actions", label: "Actions" },
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
    // localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
  }
};

const openModal = async (newSubscriberId: number) => {
  // $q.loading.show();
  console.log("Opening modal & accessing /getRogueDevices...");
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

// const closeModal = () => {
//   modalOpen.value = !modalOpen.value;
// };

const refreshTable = async () => {
  rows.value = [];
  filter.value = "";
  loading.value = true;
  try {
    rows.value = await getClients();
  } finally {
    loading.value = false;
  }
};

// Method to reset form fields
const resetForm = () => {
  selectedOnuSerialNumber.value = "";
  onuMacAddress.value = "";
  selectedLocation.value = "";
  selectedNetworkSiteValue.value = 0;
  selectedOltIp.value = null;
};

// const openProvisionModal = async (event: any) => {
//   // $q.loading.show();

//   modalProvisionClientResponse.value = true;
//   // $q.loading.hide();
// };

// const getAllClients = async () => {
//   try {
//     await refreshTable();
//   } catch (error) {
//     throw new Error("Cannot get Clients info.");
//   }
// };

// Group OLT according to their OLT Network Site
// Creates and returns an array oy OLT Network Sites (e.g. CDO_vlan2010)
const transformData = async () => {
  console.log("Fetching OLT IP data...");
  networkSiteOltIp.value = await getNetworkSiteOltIp();

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

const provisionClient = async (clientData: typeof NewClient): Promise<void> => {
  // $q.loading.show();
  modalProvisionClientResponse.value = true;
  showSkeletonDancing.value = true;
  showProvisionResult.value = false;

  console.log("NewClient Data in provisionClient:", NewClient);

  responses.autoConfig = "";
  // responses.monitoring = "";

  // try {
  //   // Execute Preprovision Check
  //   responses.provisionCheck = "Preprovision checking ...";
  //   const responsePreProvisionCheck = await preProvisionCheck(
  //     //send values to /preprovisionCheck API
  //     clientData.accountNumber,
  //     clientData.clientName,
  //     clientData.serialAndMac.serialNum,
  //     clientData.serialAndMac.macAddress,
  //     clientData.oltIp,
  //     clientData.packageType,
  //     clientData.newOltId
  //   );
  //   responses.provisionCheck = responsePreProvisionCheck.message;
  //   responseStatus.provisionCheck = true;
  // } catch (error: any) {
  //   responses.provisionCheck =
  //     error.response?.data?.message || "Preprovision check failed!";
  //   return stopProvisionFunction();
  // }

  try {
    // Exececute Auto Config
    console.log("Executing Auto Config...");
    responses.autoConfig = "Executing Auto Config...";
    const responseAutoConfig = await executeAutoConfig(
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
    if (responseAutoConfig.status === "200") {
      responses.autoConfig = responseAutoConfig.message;
      ssid.name = responseAutoConfig.ssid_name;
      ssid.pw = responseAutoConfig.ssid_pw;
      responseStatus.autoConfig = true;
      showProvisionResult.value = true;

      console.log("SSID: ", ssid.name, "Password: ", ssid.pw);
    }
  } catch (error: any) {
    responses.autoConfig =
      error.response?.data?.message || "Auto Config failed!";
    return stopProvisionFunction();
  }

  // Run monitoring in the background
  // Promise.resolve().then(async () => {
  //   try {
  //     // Execute Monitoring
  //     console.log("Executing Monitoring...");
  //     responses.monitoring = "Executing Monitoring...";
  //     const responseMonitoring = await executeMonitoring(
  //       clientData.accountNumber,
  //       clientData.clientName,
  //       clientData.serialAndMac.serialNum,
  //       clientData.serialAndMac.macAddress,
  //       clientData.oltIp,
  //       clientData.packageType,
  //       clientData.newOltId
  //       // clientData.oltReportedDownstream,
  //       // clientData.oltReportedUpstream
  //     );
  //     if (responseMonitoring) {
  //       responses.monitoring = responseMonitoring.message;
  //       responseStatus.monitoring = true;
  //       console.log("Successful monitoring execution: ", responseMonitoring);
  //     }
  //   } catch (error: any) {
  //     responses.monitoring =
  //       error.response?.data?.message || "Monitoring failed!";
  //     console.log("Error executing monitoring: ", error);
  //     return stopProvisionFunction();
  //   }
  // });

  // return stopProvisionFunction();
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
    confirmButtonText: "Yes, proceed",
    reverseButtons: true,
    allowOutsideClick: false,
  });

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

    modalProvisionClientResponse.value = true;

    // Log user action performing provisioning
    const user = keycloak.tokenParsed.given_name;
    const action = "provision subscriber";
    const details = `${user} provisioned ${client.value.subscriberAccountNumber} subscriber`;
    const page = route.path?.toString() || "Unknown Page";
    const userAgent = navigator.userAgent;

    addFrontendLogger(user, action, details, page, userAgent)
      .then(() => console.log("Frontend log sent successfully."))
      .catch((error) => console.error("Error sending frontend log: ", error));

    // Execute provisioning function
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

onMounted(async () => {
  try {
    rows.value = await getClients();
    console.log("For Provision subscribers fetched successfully.");
  } catch (error) {
    console.error("Error fetching For Provision subscribers: ", error);
    return;
  }

  try {
    await transformData();
    console.log("Data transformation completed.");
  } catch (error) {
    console.error("Error during data transformation: ", error);
  }

  // Log user action accessing the page
  const user = keycloak.tokenParsed.given_name;
  const action = "page visit";
  const details = `${user} visited the ${route.path} page`;
  const page = route.path?.toString() || "Unknown Page";
  const userAgent = navigator.userAgent;

  addFrontendLogger(user, action, details, page, userAgent)
    .then(() => console.log("Frontend log sent successfully."))
    .catch((error) => console.error("Error sending frontend log: ", error));
});

// onMounted(async () => {
//   console.log("onMounted triggered, starting data transformation...");

//   try {
//     await transformData();
//     console.log("Data transformation completed.");
//   } catch (error) {
//     console.error("Error during data transformation:", error);
//   }
// });

// onMounted(async () => {
//   await getAllClients();

//   const user = keycloak.tokenParsed.given_name;
//   const action = "accessed page";
//   const details = `${user} accessed the ${route.path} page`;
//   const page = route.path?.toString() || "Unknown Page";
//   const userAgent = navigator.userAgent;

//   addFrontendLogger(user, action, details, page, userAgent)
//     .then(() => console.log("Frontend log sent successfully."))
//     .catch((error) => console.log("Error sending frontend log: ", error));
// });
</script>
