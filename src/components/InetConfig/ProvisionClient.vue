<template>
  <q-page>
    <q-dialog v-model="isOpen" persistent>
      <q-card>
        <q-card-section class="row items-center q-py-xs">
          <div class="text-h6">For Provisioning</div>
          <q-space></q-space>
          <q-icon
            name="close"
            @click="isModal"
            size="sm"
            class="cursor-pointer btn-modal rounded q-pa-xs"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="flex-client">
          <q-input
            v-model="NewClient.accountNumber"
            filled
            label="Account Number"
            readonly
          />

          <q-input
            v-model="NewClient.clientName"
            filled
            label="Client Name"
            readonly
          />

          <q-input
            v-model="NewClient.packageType"
            filled
            label="Package Type"
            readonly
          />

          <q-select
            v-model="NewClient.serialAndMac.serialNum.label"
            label="ONU Serial Number"
            outlined
            :options="serialAndMac"
            option-label="serial_number"
            option-value="serial_number"
            @update:model-value="
              serialSelect(NewClient.serialAndMac.serialNum.label)
            "
          >
            <template #append>
              <q-icon
                name="barcode_reader"
                class="cursor-pointer"
                @click="() => (openQRCamera = !openQRCamera)"
                rounded
              />
              <q-dialog v-model="openQRCamera" style="height: 200px">
                <q-card>
                  <q-card-section>
                    <qrcode-stream
                      :formats="scannerOptions"
                      v-if="openQRCamera"
                      @detect="onDetect"
                      :track="paintBoundingBox"
                    ></qrcode-stream>
                  </q-card-section>
                </q-card>
              </q-dialog>
              <q-tooltip> Scan Barcode </q-tooltip>
            </template>
          </q-select>

          <q-input
            v-model="NewClient.serialAndMac.macAddress"
            filled
            label="ONU Mac Address"
            readonly
          >
          </q-input>

          <!-- Add the new Location Dropdown -->
          <q-select
            v-model="selectedLocation"
            :options="locations"
            label="Select Location"
            outlined
            clearable
          />

          <q-select
            v-model="selectedNetworkSite"
            :options="filteredNetworkSites"
            option-label="oltNetworksite"
            option-value="oltNetworksite"
            label="Select Network Site(VLAN)"
            map-options
            clearable
            outlined
            :anchor="'top right'"
            :self="'top left'"
            fit
          />

          <q-select
            v-if="selectedNetworkSite"
            v-model="NewClient.oltIp"
            :options="selectedNetworkSite.oltIps"
            option-label="oltIp"
            option-value="oltIp"
            label="Select OLT IP"
            map-options
            emit-value
            clearable
            outlined
            :anchor="'top right'"
            :self="'top left'"
            fit
          >
            <template v-slot:option="{ itemProps, opt }">
              <q-item v-bind="itemProps">
                <q-item-section>
                  <q-item-label>
                    {{ opt.oltName }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="NewClient.newOltId"
            filled
            label="OLT ID"
            readonly
            style="display: none"
          />

          <!-- for revision of OLT IP selection -->
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            :disable="
              !(
                NewClient.serialAndMac.serialNum.label &&
                NewClient.serialAndMac.macAddress &&
                NewClient.oltIp
              )
            "
            flat
            type="submit"
            :label="
              NewClient.oltIp &&
              NewClient.serialAndMac.serialNum.label &&
              NewClient.serialAndMac.macAddress
                ? 'ACTIVATE'
                : 'Missing Inputs'
            "
            color="primary full-width"
            @click="provisionClient"
          />
        </q-card-actions>
        <q-banner class="bg-primary text-white q-pt-none">
          <div class="text-center">
            <h1 class="text-h6">Responses</h1>
          </div>
          <div>
            <!-- <p>
              Client:
              <span
                :class="
                  responseStatus.subscriber ? 'text-positive' : 'text-warning'
                "
                >{{ responses.subscriber }}</span
              >
            </p> -->
            <p>
              Preprovision Checking:
              <span
                :class="
                  responseStatus.provisionCheck
                    ? 'text-positive'
                    : 'text-warning'
                "
                >{{ responses.provisionCheck }}</span
              >
            </p>
            <p>
              Auto Config:
              <span
                :class="
                  responseStatus.autoConfig ? 'text-positive' : 'text-warning'
                "
                >{{ responses.autoConfig }}</span
              >
            </p>
            <p>
              Monitoring:
              <span
                :class="
                  responseStatus.monitoring ? 'text-positive' : 'text-warning'
                "
                >{{ responses.monitoring }}</span
              >
            </p>
            <div v-if="showProvisionResult" class="text-center">
              <q-separator class="q-mb-sm" />
              <p
                class="text-uppercase text-bold"
                :class="
                  responseStatus.autoConfig && responseStatus.monitoring
                    ? 'text-positive'
                    : 'text-warning'
                "
              >
                {{
                  responseStatus.autoConfig && responseStatus.monitoring
                    ? " Successful Provision!"
                    : "Unsuccessful Provision!"
                }}
              </p>
              <p v-if="ssid.name || ssid.pw">
                SSID: {{ ssid.name }} Password: {{ ssid.pw }}
              </p>
            </div>
          </div>
        </q-banner>
        <!-- <q-img
          v-if="showSkeletonDancing"
          src="~assets/dance.gif"
          class="skeleton-dance"
        ></q-img> -->
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import {
  toRefs,
  reactive,
  ref,
  watchEffect,
  onUpdated,
  watch,
  onMounted,
} from "vue";
import {
  executeAutoConfig,
  executeMonitoring,
  getAllOlts,
  testError,
  preProvisionCheck,
  getNetworkSiteOltIp,
} from "src/api/HiveConnectApis/hiveConnect";
import { IsubsriberType, IserialAndMac } from "../models";
import { QrcodeStream } from "vue-qrcode-reader";
import { useQuasar } from "quasar";
import { IOlt, IOltSiteByIp } from "src/api/HiveConnectApis/types";

//////////////////////
////VARIABLES AREA////
//////////////////////

const $q = useQuasar();
const props = defineProps<{
  isOpen: boolean;
  serialAndMac: IserialAndMac[];
  client: IsubsriberType;
  closeModal: Function;
}>();
const openQRCamera = ref(false);
const { isOpen } = toRefs(props);

const isModal = () => {
  props.closeModal();
};

const ssid = reactive({
  name: "",
  pw: "",
});

const showProvisionResult = ref(false);
const showSkeletonDancing = ref(false);
const optionsOltIp = ref<IOlt[]>([]);
const filteredOptions = ref<IOlt[]>([]);

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

const result = ref("");

const NewClient = reactive({
  bucketId: 0,
  clientId: 0,
  accountNumber: "",
  packageType: "",
  oltReportedUpstream: 0,
  oltReportedDownstream: 0,
  serialAndMac: {
    serialNum: {
      label: "",
    },
    macAddress: "",
  },
  oltIp: "",
  newOltId: 0,
  clientName: "",
});

// added new variables for revision of OLT IP selection
const networkSites = ref([]);
const selectedNetworkSite = ref(null);
const selectedOltIp = ref(null);
const networkSiteOltIp = ref<IOltSiteByIp[]>([]);
// Define the locations for filtering
const locations = ref([
  "Select Location",
  "CDO",
  "MALAYBALAY",
  "DAVAO",
  "BUTUAN",
  "DIGOS",
  "GENSAN",
  "TAGUM",
  "CEBU",
  "KORONADAL",
  "SANTIAGO",
  "SANTO TOMAS",
  "VALENCIA",
  "PAGADIAN",
  "ILIGAN",
  "PANABO",
  "SAN FRANZ",
  "BISLIG",
  "TANDAG",
  "TACLOBAN",
]);
const selectedLocation = ref("");

// Define the networkSites data and the filtered version
const filteredNetworkSites = ref([]); // List of sites filtered by selected location

//////////////////////
////METHODS AREA/////
//////////////////////

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
  }, []);

  networkSites.value = groupedData;
  console.log("Grouped data:", groupedData);

  // Initial setting of filteredNetworkSites
  filteredNetworkSites.value = networkSites.value;
  console.log("networkSites:", networkSites.value);
};

const filterNetworkSites = () => {
  // Log the selected location being filtered
  console.log("Filtering network sites for location:", selectedLocation.value);

  // Log the original network sites before filtering
  console.log("Original network sites:", networkSites.value);

  // Check if the selected location is empty or the default option
  if (
    selectedLocation.value === "" ||
    selectedLocation.value === "Select Location"
  ) {
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

// Watch for changes to selectedLocation and apply filtering
watch(selectedLocation, (newValue) => {
  filterNetworkSites();
});

const filterSelect = (val: string, update: any) => {
  if (val === "") {
    update(() => {
      filteredOptions.value = optionsOltIp.value;
    });
  }
  update(() => {
    const needle = val.toLowerCase();
    filteredOptions.value = optionsOltIp.value.filter((options: IOlt) => {
      return options.oltName.toLowerCase().includes(needle);
    });
  });
};

const findSerialInRogue = (
  barcodeSerial: string,
  serialAndMac: { serial_number: string; mac_address: string }[]
): { serial: string; mac: string } => {
  for (const obj of serialAndMac) {
    if (obj.serial_number === barcodeSerial) {
      return { serial: obj.serial_number, mac: obj.mac_address };
    }
  }
  return { serial: "", mac: "" };
};

const onDetect = (detectedCodes: any): void => {
  const resultQr = detectedCodes.map((code: any) => code.rawValue);
  console.log(resultQr);

  openQRCamera.value = false;
  result.value = resultQr[0];
  const { serial, mac } = findSerialInRogue(resultQr[0], props.serialAndMac);
  if (serial && mac) {
    NewClient.serialAndMac.macAddress = mac;
    NewClient.serialAndMac.serialNum.label = serial;
  } else {
    notifForMissingInRogue();
  }
};

const serialSelect = (serialNum: {
  serial_number: string;
  mac_address: string;
}) => {
  for (const obj of props.serialAndMac) {
    if (obj.serial_number === serialNum.serial_number) {
      NewClient.serialAndMac.macAddress = obj.mac_address;
      NewClient.serialAndMac.serialNum.label = obj.serial_number;
    }
  }
};

const paintBoundingBox = (detectedCodes: any, ctx: any): void => {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#007bff";
    ctx.strokeRect(x, y, width, height);
  }
};

const provisionClient = async (): Promise<void> => {
  $q.loading.show();
  showSkeletonDancing.value = true;
  showProvisionResult.value = false;

  responses.autoConfig = "";
  responses.monitoring = "";

  try {
    responses.provisionCheck = "Preprovision checking ...";
    const response = await preProvisionCheck(
      //send values to /preprovisionCheck API
      NewClient.accountNumber,
      NewClient.clientName,
      NewClient.serialAndMac.serialNum.label,
      NewClient.serialAndMac.macAddress,
      NewClient.oltIp,
      NewClient.packageType,
      NewClient.newOltId
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
      NewClient.accountNumber,
      NewClient.clientName,
      NewClient.serialAndMac.serialNum.label,
      NewClient.serialAndMac.macAddress,
      NewClient.oltIp,
      NewClient.packageType,
      NewClient.newOltId,
      NewClient.oltReportedDownstream,
      networkSiteOltIp,
      NewClient.oltReportedUpstream
    );
    if (response) {
      responses.autoConfig = response.message;
      responseStatus.autoConfig = true;
    }
  } catch (error) {
    responses.autoConfig = "Error: " + error;
    return stopProvisionFunction();
  }

  try {
    responses.monitoring = "Executing Monitoring...";
    const response = await executeMonitoring(
      NewClient.accountNumber,
      NewClient.clientName,
      NewClient.serialAndMac.serialNum.label,
      NewClient.serialAndMac.macAddress,
      NewClient.oltIp,
      NewClient.packageType,
      NewClient.newOltId,
      NewClient.oltReportedDownstream,
      NewClient.oltReportedUpstream
    );
    if (response) {
      responses.monitoring = response.message;
      ssid.name = response.ssid_name;
      ssid.pw = response.ssid_pw;
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

const stopProvisionFunction = () => {
  showSkeletonDancing.value = false;
  $q.loading.hide();
};

const notifForMissingInRogue = (): void => {
  $q.notify({
    message: "Scanned Value is not in rogue devices!",
    color: "negative",
    position: "top",
  });
};

/////////////////////
///LIFECYCLE HOOKS///
/////////////////////
onUpdated(async () => {
  NewClient.serialAndMac.serialNum.label = props.client?.onuSerialNumber;
  NewClient.serialAndMac.macAddress = props.client?.onuMacAddress;
});

watchEffect(() => {
  NewClient.clientId = props.client?.newSubscriberId;
  NewClient.accountNumber = props.client?.subscriberAccountNumber;
  NewClient.clientName = props.client?.subscriberName;
  NewClient.oltIp = props.client?.oltIp;
  NewClient.newOltId = props.client?.newOltId;
  NewClient.packageType = props.client?.packageType;
  NewClient.oltReportedDownstream = props.client?.oltReportedDownstream;
  NewClient.oltReportedUpstream = props.client?.oltReportedUpstream;
});

/**
 * added new function to transform data
 * added new line to reset OLT IP selected value
 */
watch(
  [result, selectedNetworkSite, networkSiteOltIp],
  (
    [newVal, newSelectedSite, newNetworkOlt],
    [oldVal, oldSelectedSite, oldNetworkOlt]
  ) => {
    if (oldVal !== newVal) {
      openQRCamera.value = false;
    } else if (oldSelectedSite !== newSelectedSite) {
      selectedOltIp.value = null;
    } else if (oldNetworkOlt !== newNetworkOlt) {
      console.log(networkSites.value);
    }
  }
);

// Watch for changes in selected OLT IP and update newOltId
watch(
  () => NewClient.oltIp,
  (newOltIp) => {
    if (newOltIp && selectedNetworkSite.value) {
      // Find the corresponding newOltId based on selected OLT IP
      const selectedOlt = selectedNetworkSite.value.oltIps.find(
        (olt) => olt.oltIp === newOltIp
      );
      NewClient.newOltId = selectedOlt ? selectedOlt.newOltId : null;
      console.log("newOltId after oltIp selection:", NewClient.newOltId);
    }
  }
);

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

<style scoped>
.flex-client {
  /* min-width: 350px; */
  /* width: 100%; */
  display: grid;
  gap: 0.5em;
  z-index: 0;
}
.q-dialog .q-card {
  width: 100%;
  max-width: 500px;
}
.btn-modal:hover {
  background-color: #c10015;
  color: white;
  border-radius: 100%;
}
.skeleton-dance {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}
@media screen and (min-width: 1000px) {
  .flex-client {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .q-banner {
    width: 100%;
    max-width: inherit;
  }
  .q-dialog .q-card {
    max-width: 800px;
  }
}
</style>
