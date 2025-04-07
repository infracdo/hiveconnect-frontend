<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="flex flex-row full-width q-mb-md item-center justify-between">
        <div class="flex flex-row items-center">
          <Buttons
            icon="eva-arrow-back-outline"
            label="Back"
            color="bg-gray-iron-100"
            class="mr-4"
            textColor="text-gray-iron-900 font-normal"
            @click="goBack"
            small
            normal
          />

          <p class="text-sm text-semibold leading-5">
            <span class="text-primary-600 font-medium"
              >Active/Onhold Subscribers /
            </span>
            <span>{{
              provisionedSubscriberData.subscriberAccountNumber
                ? provisionedSubscriberData.subscriberAccountNumber
                : "N/A"
            }}</span>
          </p>
        </div>

        <div class="flex flex-row items-center gap-4">
          <!-- Button to send an inform to ABS after successful activation (change status to ABS)-->
          <Buttons
            icon="img:/icons/paper_plane.svg"
            label="Change Status on ABS"
            color="bg-gray-iron-100"
            textColor="text-gray-iron-900"
            small
            @click="handleAbsStatusCallback"
          />
        </div>
      </div>

      <div class="flex flex-row w-full">
        <div class="flex flex-col basis-3/4">
          <div class="flex flex-row mb-6">
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">SUBSCRIBER NAME</p>
              <p class="text-xl font-medium text-gray-iron-900">
                {{
                  provisionedSubscriberData.clientName
                    ? toInitialCapital(provisionedSubscriberData.clientName)
                    : "N/A"
                }}
              </p>
            </div>

            <q-separator vertical inset size="2px" class="mx-4" />

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">ACCOUNT NO.</p>
              <p class="text-xl font-normal text-gray-iron-900">
                {{
                  provisionedSubscriberData.subscriberAccountNumber
                    ? provisionedSubscriberData.subscriberAccountNumber
                    : "N/A"
                }}
              </p>
            </div>

            <q-separator vertical inset size="2px" class="mx-4" />

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">STATUS</p>
              <span
                :class="[
                  'flex items-center justify-center text-sm font-semibold bg-gray-iron-50 px-2 py-1 rounded-lg',
                  provisionedSubscriberData.status === 'ACTIVE'
                    ? 'text-success-500'
                    : 'text-error-500',
                ]"
              >
                <StatusBadge
                  :status="
                    provisionedSubscriberData.status === 'ACTIVE' ? true : false
                  "
                  class="inline pr-1"
                />
                {{ provisionedSubscriberData.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">PACKAGE TYPE</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.packageType
                    ? provisionedSubscriberData.packageType
                    : "N/A"
                }}
              </p>
            </div>

            <!-- Device Name -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">DEVICE NAME</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.onuDeviceName
                    ? provisionedSubscriberData.onuDeviceName
                    : "N/A"
                }}
              </p>
            </div>

            <!-- IP Assigned -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500 uppercase">IP ASSIGNED</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.ipAssigned
                    ? provisionedSubscriberData.ipAssigned
                    : "N/A"
                }}
              </p>
            </div>

            <!-- ONU Serial Number -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">ONU SERIAL NUMBER</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.onuSerialNumber
                    ? provisionedSubscriberData.onuSerialNumber
                    : "N/A"
                }}
              </p>
            </div>

            <!-- ONU Mac Address -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500 uppercase">
                ONU MAC ADDRESS
              </p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.onuMacAddress
                    ? provisionedSubscriberData.onuMacAddress
                    : "N/A"
                }}
              </p>
            </div>

            <!-- OLT IP -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500 uppercase">OLT IP</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.oltIp
                    ? provisionedSubscriberData.oltIp
                    : "N/A"
                }}
              </p>
            </div>

            <!-- SSID -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">SSID</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  provisionedSubscriberData.ssidName
                    ? provisionedSubscriberData.ssidName
                    : "N/A"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="flex flex-row justify-between items-center mb-2">
          <p class="text-xl font-medium text-gray-iron-900">
            Troubleshoot Subscriber
          </p>

          <div class="flex flex-row items-center q-gutter-x-md mb-2">
            <q-icon
              flat
              name="autorenew"
              size="sm"
              class="cursor-pointer"
              @click="handleRefreshData"
            />

            <DropdownButton
              label="Select Time"
              :columnOptions="timeOptions"
              :selectedOptions="selectedTime"
              @select="handleSelectTime"
            />
          </div>
        </div>

        <!-- Subscriber Details Card -->
        <Card
          header="Subscriber Details"
          :details="[
            { label: 'Subscriber Name', value: subscriberInfo.clientName },
            { label: 'Account Number', value: subscriberInfo.accountNumber },
            { label: 'Package Type', value: subscriberInfo.packageTypeId },
          ]"
          :loading="isLoading"
        />

        <!-- ONU Details Card -->
        <Card
          header="ONU Details"
          :details="[
            {
              label: 'ONU Status',
              value: selectedTime
                ? onuInfo.site_status === 'active'
                  ? 'Online'
                  : 'Offline'
                : '',
            },
            { label: 'ONU IP', value: onuInfo.instance },
            { label: 'SSID', value: subscriberInfo.SSID },
            {
              label: 'ONU Serial Number',
              value: subscriberInfo.onuSerialNumber,
            },
            {
              label: 'ONU Mac Address',
              value: subscriberInfo.onuMacAddress,
            },
            { label: 'Upstream', value: subscriberInfo.oltUpstream },
            {
              label: 'Downstream',
              value: subscriberInfo.oltDownstream,
            },
          ]"
          :loading="isLoading"
        />

        <!-- OLT Details Card -->
        <Card
          header="OLT Details"
          :details="[
            {
              label: 'OLT Status',
              value: selectedTime
                ? oltStatus === 'active'
                  ? 'Online'
                  : 'Offline'
                : '',
            },
            { label: 'OLT IP', value: subscriberInfo.oltIp },
            { label: 'OLT Site', value: subscriberInfo.oltSite },
            { label: 'OLT Interface', value: subscriberInfo.oltInterface },
            {
              label: 'OLT Upstream',
              value: selectedTime ? subscriberInfo.oltUpstream : '',
            },
            {
              label: 'OLT Downstream',
              value: selectedTime ? subscriberInfo.oltDownstream : '',
            },
          ]"
          :loading="isLoading"
        />

        <!-- Grafana Panel -->
        <div class="mt-6">
          <iframe
            v-if="donePrometheusCall"
            :src="grafanaPanelUrl"
            class="grafana-panel"
            frameborder="0"
          >
          </iframe>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { useQuasar } from "quasar";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import {
  getHiveClientById,
  getOltSiteByIp,
  checkPackageDetails,
  addFrontendLogger,
  sendHiveProvisionedStatusCallback,
} from "src/api/HiveConnectApis/hiveConnect";
import { toInitialCapital } from "src/util/string";
import { useKeycloak } from "src/composables/useKeycloak";
import Card from "../Card.vue";
import DropdownButton from "../DropdownButton.vue";
import StatusBadge from "../StatusBadge.vue";
import Buttons from "../inputs/Buttons.vue";

const router = useRouter();
const route = useRoute();
const keycloak = useKeycloak();
// const doneApiCalls = ref(false);
const selectedTime = ref("2d");
const onuStatus = ref("");
const oltStatus = ref("");
// const deviceName = ref("");
const subscriberId = ref(0);
const accountNumber = ref("");
const isLoading = ref(false);
const donePrometheusCall = ref(false);
// const subscriberAccountNo = route.params.accountNo;
const provisionedSubscriberData = ref(
  (router.options.history.state as { provisionedSubscriberData?: any })
    ?.provisionedSubscriberData || {}
);
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const grafanaApi = process.env.PROVISION_API_GRAFANA;

// const onuInfo = ref({
//   __name__: "",
//   device_name: "",
//   device_role: "",
//   instance: "",
//   job: "",
//   site_name: "",
//   site_status: "",
//   site_tenant: "",
//   olt_ip: "",
//   vlan_690_ip: "",
//   provisioned_by: "",
// });

const onuInfo = ref({
  __name__: "",
  account_number: "",
  device_role: "",
  instance: "",
  job: "",
  site_status: "",
  site_tenant: "",
});

const subscriberInfo = reactive({
  accountNumber: "",
  clientName: "",
  ipAssigned: "",
  onuSerialNumber: "",
  oltIp: "",
  onuMacAddress: "",
  onuDeviceName: "",
  packageTypeId: "",
  oltSite: "",
  oltInterface: "",
  SSID: "",
  otcStatus: "", // Payment Status in UI
  oltUpstream: "", // Changed from number (0) to string
  oltDownstream: "", // Changed from number (0) to string
});
const bandwidth = reactive({
  upStream: "",
  downStream: "",
  name: "",
});

const timeOptions = [
  { label: "No Evaluation Time", value: "" },
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 30 minutes", value: "30m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 3 hours", value: "3h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 12 hours", value: "12h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 2 days", value: "2d" },
  { label: "Last 90 days", value: "90d" },
];

const grafanaPanelUrl = computed(() => {
  if (!accountNumber.value) return "";
  console.log(
    "Stored value in 'accountNumber' variable: ",
    accountNumber.value
  );
  console.log("Selected Time: ", selectedTime.value);

  const baseUrl = `${grafanaApi}/d/1_dw5n2Hk/subscribers-traffic-rate-and-uptime`;
  const orgId = "orgId=1";
  const subscriberVariable = `var-subscriber=${accountNumber.value}`;
  const relativeTimeRange = selectedTime.value
    ? `&from=now-${selectedTime.value}&to=now`
    : "";

  return `${baseUrl}?${orgId}&${subscriberVariable}${relativeTimeRange}&viewPanel=3`;
});

// Method to trigger when 'Change Status on ABS' button is clicked
const handleAbsStatusCallback = () => {
  Swal.fire({
    title: "Confirm",
    text: "Are you sure you want to change the status of this subscriber on ABS?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1d6499",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed",
    reverseButtons: true,
    allowOutsideClick: false,
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      // Send user action to backend for attempting to change the subscriber status on ABS
      const user = keycloak.tokenParsed.given_name;
      const action = "change subscriber status on ABS";
      const details = `${user} attempted to change the status of ${provisionedSubscriberData.value.subscriberAccountNumber} subscriber on ABS`;
      const page = route.path?.toString() || "Unknown Page";
      const userAgent = navigator.userAgent;

      addFrontendLogger(user, action, details, page, userAgent)
        .then(() => console.log("Frontend log sent successfully."))
        .catch((error) => console.error("Error sending frontend log: ", error));

      // Execute changing subscriber status on ABS through API call
      try {
        const response = await sendHiveProvisionedStatusCallback(
          provisionedSubscriberData.value.subscriberAccountNumber
        );

        let successMessage = "Successfully changed subscriber status on ABS.";
        if (response.message) {
          try {
            const parsedMessage = JSON.parse(response.message);
            successMessage = parsedMessage.message || successMessage;
          } catch (e) {
            console.error("Failed to parse success message: ", e);
          }
        }

        Swal.fire({
          title: "Success",
          text: successMessage,
          icon: "success",
          confirmButtonColor: "#1d6499",
        });
      } catch (error) {
        let errorMessage = "An unknown error occurred.";

        if (error instanceof Error) {
          try {
            // Parse the outer error message
            const errorResponse = JSON.parse(error.message);
            // Extract the message field which is a stringified JSON
            const nestedMessageString =
              errorResponse.message.match(/"({.*})"/)?.[1];

            if (nestedMessageString) {
              // Parse the extracted JSON string
              const nestedMessage = JSON.parse(nestedMessageString);
              errorMessage = nestedMessage.message || errorResponse.message;
            } else {
              errorMessage = errorResponse.message;
            }
          } catch (e) {
            console.error("Error parsing nested error message: ", e);
            errorMessage = error.message;
          }
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#fd0808",
        });
        return false;
      }
    },
  });
};

// Function to trigger when the Back button is clicked
const goBack = () => {
  router.push({ name: "provisioned" });
};

// Function to trigger when the refresh button is clicked
const handleRefreshData = () => {
  try {
    getInfoApiPrometheus(accountNumber.value, subscriberId.value);
  } catch (error) {
    console.error("Error while clicking the refresh button: ", error);
    throw error;
  }
};

// Function to trigger when the 'Select Time' dropdown is clicked
const handleSelectTime = (time: { label: string; value: string }) => {
  selectedTime.value = time.value;
  console.log("Selected Time: ", selectedTime.value);
};

const getInfoApiPrometheus = async (accNumber: string, id: number) => {
  isLoading.value = true;
  try {
    donePrometheusCall.value = false;

    console.log(
      `Passed data to getInfoApiPrometheus function - Account Number: ${accNumber}, ID: ${id}`
    );

    if (!accNumber && !id) {
      return;
    }

    // Fetch subscriber info from Prometheus
    const onuPrometheusResponse = await axios.get(
      `${prometheusApi}/api/v1/query?query=lo_status{job="subscriber",site_tenant="DATACONNECT",account_number="${accNumber}"}`
    );
    console.log(
      "Returned ONU Info Response from Prometheus: ",
      onuPrometheusResponse
    );
    // console.log(
    //   "Returned Subscriber Info Metric: ",
    //   subscriberInfoResponse.data.data.result.metric
    // );

    // Fetch ONU info from Prometheus
    // const onuInfoResponse = await axios.get(
    //   `${prometheusApi}/api/v1/query?query=lo_status{job=%22subscriber%22,site_tenant=%22DATACONNECT%22,account_number="${accNumber}"}`
    // );
    // console.log("Returned ONU Prometheus Response: ", onuInfoResponse);
    // console.log(
    //   "Returned ONU Prometheus Metric: ",
    //   onuInfoResponse.data.data.result[0].metric
    // );

    // onuInfo.value = onuInfoResponse.data.data.result[0].metric;
    // console.log("Stored ONU Info Data: ", onuInfo.value);
    // onuStatus.value = onuInfoResponse.data.data.result[0].value[1];
    // console.log("Stored ONU Status Data: ", onuStatus.value);

    if (onuPrometheusResponse.data.data.result.length > 0) {
      console.log(`ONU Data Found in Prometheus for Subscriber ${accNumber}`);

      onuInfo.value = onuPrometheusResponse.data.data.result[0].metric;
      console.log("Stored ONU Info Data: ", onuInfo.value);

      // onuStatus.value = onuPrometheusResponse.data.data.result[0].value[1];
      // console.log("Stored ONU Status Data: ", onuStatus.value);

      // const OltDeviceName = onuInfo.value.olt_ip;
      // console.log("Stored OLT Device Name: ", OltDeviceName);

      // oltStatus.value = onuPrometheusResponse.data.data.result[0].value[1];
      // console.log("Stored OLT Status Data: ", oltStatus.value);

      const subscriberData = await getHiveClientById(id);

      subscriberInfo.accountNumber = subscriberData.subscriberAccountNumber;
      subscriberInfo.clientName = subscriberData.clientName;
      subscriberInfo.ipAssigned = subscriberData.ipAssigned;
      subscriberInfo.oltIp = subscriberData.oltIp;
      subscriberInfo.SSID = subscriberData.ssidName;
      subscriberInfo.oltInterface = subscriberData.oltInterface;
      subscriberInfo.onuDeviceName = subscriberData.onuDeviceName;
      subscriberInfo.onuMacAddress = subscriberData.onuMacAddress;
      subscriberInfo.onuSerialNumber = subscriberData.onuSerialNumber;
      subscriberInfo.packageTypeId = subscriberData.packageType;
      subscriberInfo.oltUpstream = subscriberData.oltReportedUpstream;
      subscriberInfo.oltDownstream = subscriberData.oltReportedDownstream;

      console.log("Stored Data in subscriberInfo variable: ", subscriberInfo);

      try {
        // TODO: instead of using the 'subscriberInfo.oltIp' as the argument for fetching the oltSiteData, use the OLT data fetched from Prometheus, but since there was still no query for OLT in Prometheus, I used the oltIP value from the subscriberInfo instead.
        const oltSiteData = await getOltSiteByIp(subscriberInfo.oltIp);
        console.log("Fetched OLT Site Data by IP: ", oltSiteData);

        subscriberInfo.oltSite = oltSiteData.oltNetworksite;
        console.log("Stored OLT Site in OLT Site: ", subscriberInfo.oltSite);
      } catch (err) {
        console.error(
          "Error while fetching OLT site and package details: ",
          err
        );
        throw err;
      }
    } else {
      console.warn(
        `No ONU Data Found in Prometheus for Subscriber ${accNumber}`
      );
    }

    // Fetch OLT info from Prometheus
    // const oltInfoResponse = await axios.get(
    //   `${prometheusApi}/api/v1/query?query=lo_status{job=%22subscriber%22,site_tenant=%22DATACONNECT%22,account_number="${accNumber}"}`
    // );
    // console.log("Returned OLT Prometheus Response: ", oltInfoResponse);

    // oltStatus.value = oltInfoResponse.data.data.result[0].value[1];
    // console.log("Stored OLT Status Data: ", oltStatus.value);

    // doneApiCalls.value = true;
  } catch (err) {
    console.log("Error while fetching data from Prometheus: ", err);
    throw err;
  } finally {
    isLoading.value = false;
    donePrometheusCall.value = true;
  }
};

// Watch when a time is selected and retry Grafana
// watch(selectedTime, () => {
//   retryGrafana();
// });

// watch(isVisible, () => {
//   if (isVisible.value === true) {
//     getInfoApiPrometheus(props.deviceName, props.clientId);
//   }
// });

onMounted(() => {
  if (provisionedSubscriberData.value) {
    // deviceName.value = provisionedSubscriberData.value.onuDeviceName;
    accountNumber.value =
      provisionedSubscriberData.value.subscriberAccountNumber;
    subscriberId.value = provisionedSubscriberData.value.id;
    console.log(
      "Data received from Active/Onhold Subscribers Page: ",
      provisionedSubscriberData.value
    );

    try {
      // Fetch subscriber data from Prometheus
      getInfoApiPrometheus(accountNumber.value, subscriberId.value);
    } catch (error) {
      console.error("Error fetching subscriber data from Prometheus: ", error);
      throw error;
    }
  } else {
    console.log("No data received from Active/Onhold Subscribers Page.");
  }

  const user = keycloak.tokenParsed.given_name;
  const action = "page visit";
  const details = `${user} visited the ${route.path} page`;
  const page = route.path?.toString() || "Unknown Page";
  const userAgent = navigator.userAgent;

  addFrontendLogger(user, action, details, page, userAgent)
    .then(() => console.log("Frontend log sent successfully."))
    .catch((error) => console.error("Error sending frontend log: ", error));
});
</script>

<style scoped>
/* .sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
} */

.grafana-panel {
  width: 100%;
  aspect-ratio: 16 / 7;
  max-width: 1200px;
}

@media screen and (min-width: 690px) {
  .grafana-panel {
    aspect-ratio: 16 / 5;
    max-width: 100%;
  }
}
</style>
