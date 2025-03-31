<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headings here -->
        <div>
          <!-- Page title here -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Troubleshoot
          </div>

          <!-- Page description here -->
          <p class="text-sm font-regular text-gray-iron-500">
            Displays subscriber information, including subscriber, ONU and
            <br />
            OLT data, and a Grafana panel for real-time network insights.
          </p>
        </div>

        <!-- Select filter fields here -->
        <div class="flex flex-row-reverse w-full">
          <!-- Dropdown button here -->
          <div class="flex flex-row q-gutter-x-md items-center">
            <!-- Refresh button to reload the selected subscriber info -->
            <q-icon
              @click="fetchSubscriberInfo(selectedSubscriber)"
              flat
              name="autorenew"
              size="sm"
              class="cursor-pointer"
            />

            <!-- Select time dropdown button -->
            <DropdownButton
              @select="handleSelectTime"
              :columnOptions="timeOptions"
              :selectedOptions="selectedTime"
              label="Select Time"
            />

            <!-- Select subscriber dropdown button -->
            <DropdownButton
              @select="handleSelectSubscriber"
              :columnOptions="dropdownSubscriberOptions"
              :selectedOptions="selectedSubscriber"
              label="Select Subscriber"
            />
          </div>
        </div>

        <!-- Content container here -->
        <div class="full-width">
          <!-- Subscriber details card -->
          <Card
            header="Subscriber Details"
            :details="[
              { label: 'Account Number', value: subscriberInfo.accountNumber },
              { label: 'Subscriber Name', value: subscriberInfo.clientName },
              { label: 'Package Type', value: subscriberInfo.packageType },
            ]"
            :loading="isLoading"
          />

          <!-- ONU details card -->
          <Card
            header="ONU Details"
            :details="[
              {
                label: 'ONU Status',
                value: onuInfo
                  ? onuInfo.site_status === 'active'
                    ? 'Online'
                    : 'Offline'
                  : '',
              },
              { label: 'ONU IP', value: onuInfo.instance },
              {
                label: 'ONU Serial Number',
                value: subscriberInfo.onuSerialNumber,
              },
              { label: 'ONU Mac Address', value: subscriberInfo.onuMacAddress },
              { label: 'Upstream', value: subscriberInfo.oltUpstream },
              { label: 'Downstream', value: subscriberInfo.oltDownstream },
            ]"
            :loading="isLoading"
          />

          <!-- OLT details card -->
          <Card
            header="OLT Details"
            :details="[
              {
                label: 'OLT Status',
                value: selectedSubscriber
                  ? oltStatus === '1'
                    ? 'Online'
                    : 'Offline'
                  : '',
              },
              { label: 'OLT IP', value: subscriberInfo.oltIp },
              { label: 'OLT Site', value: 'test-site' },
              { label: 'OLT Interface', value: subscriberInfo.oltInterface },
            ]"
            :loading="isLoading"
          />

          <!-- Grafana panel -->
          <div class="grafana-main">
            <div class="grafana">
              <iframe
                v-if="donePrometheusCall"
                :src="`${grafanaApi}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectedTime}&to=now&var-Subscriber=${selectedSubscriber}&panelId=3`"
                class="grafana-panel"
                frameborder="0"
              >
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import {
  getHiveActiveSubscribers,
  addFrontendLogger,
  getHiveClientById,
} from "src/api/HiveConnectApis/hiveConnect";
import { useKeycloak } from "src/composables/useKeycloak";
import DropdownButton from "src/components/DropdownButton.vue";
import Card from "src/components/Card.vue";

const route = useRoute();
const keycloak = useKeycloak();
const dropdownSubscriberOptions = ref<{ label: string; value: string }[]>([]);
const selectedSubscriber = ref("");
const selectedTime = ref("");
const isLoading = ref(false);
// const onuStatus = ref<string | null>(null);
const oltStatus = ref<string | null>(null);
const donePrometheusCall = ref(false);
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const grafanaApi = process.env.PROVISION_API_GRAFANA;

// Stores ONU information from Prometheus API call
const onuInfo = ref({
  device_role: "", // ONU device
  instance: "", // ONU IP (ip_assigned in database)
  site_status: "", // Either "active" or "inactive"
  site_tenant: "", // Should be "DATACONNECT"
});

// Stores subscriber information from backend/database API call
const subscriberInfo = reactive({
  accountNumber: "",
  clientName: "",
  onuSerialNumber: "",
  oltIp: "",
  onuMacAddress: "",
  // oltSite: "",
  oltInterface: "",
  packageType: "",
  deviceName: "",
  ipAssigned: "",
  oltUpstream: "",
  oltDownstream: "",
});

// const bandwidth = reactive({
//   upStream: "",
//   downStream: "",
// });

// Options for 'Select Time' dropdown button
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

// Function to fetch the subscriber info based on the selected subscriber; used also when the refresh icon button is clicked
const fetchSubscriberInfo = async (subscriberId: string) => {
  isLoading.value = true;
  console.log("Passed Subscriber ID: ", subscriberId);
  if (!subscriberId) return; // Ensure a subscriber is selected

  // Convert the passed subscriber ID from string to number/integer as parameter for the API call
  const numSubscriberId = Number(subscriberId);
  console.log("Convert subscriber ID from string to number: ", numSubscriberId);

  // Fetch other client info based on selected device name
  try {
    // Fetch the subscriber info from the database through API call
    const subscriberData = await getHiveClientById(numSubscriberId);
    console.log("Fetched selected subscriber info: ", subscriberData);

    // Assign the values to its corresponding variables if there's subscriber information fetched
    if (subscriberData) {
      Object.assign(subscriberInfo, {
        accountNumber: subscriberData.subscriberAccountNumber,
        clientName: subscriberData.clientName,
        onuSerialNumber: subscriberData.onuSerialNumber,
        oltIp: subscriberData.oltIp,
        onuMacAddress: subscriberData.onuMacAddress,
        //oltSite: client.oltSite,
        oltInterface: subscriberData.oltInterface,
        packageType: subscriberData.packageType,
        deviceName: subscriberData.onuDeviceName,
        ipAssigned: subscriberData.ipAssigned,
        oltUpstream: subscriberData.oltReportedUpstream,
        oltDownstream: subscriberData.oltReportedDownstream,
      });
      console.log("Selected Subscriber Data: ", subscriberInfo);

      // Call the 'getInfoApiPrometheus' function to fetch the subscriber's ONU and OLT data from Prometheus through API call
      await getInfoApiPrometheus(subscriberInfo.accountNumber);
    } else {
      console.warn("No subscriber data from the database.");
    }
  } catch (error) {
    console.error("Error fetching subscriber info:", error);
    throw error;
  }
};

// Function when the 'Select Status' dropdown is clicked
const handleSelectTime = (time: { label: string; value: string }) => {
  selectedTime.value = time.value;
  console.log("Selected Time: ", selectedTime.value);
};

// Function when the 'Select Subscriber' dropdown is clicked
const handleSelectSubscriber = (subscriber: {
  label: string;
  value: string;
}) => {
  selectedSubscriber.value = subscriber.value;
  console.log("Selected Subscriber: ", selectedSubscriber.value);

  // Call the 'fetchSubscriberInfo' function to fetch subscriber info based on the selected subscriber
  fetchSubscriberInfo(selectedSubscriber.value);
};

// Fetch ACTIVE subscribers to populate the 'Select Subscriber' dropdown
const fetchActiveSubscribers = async () => {
  try {
    const activeSubscribers = await getHiveActiveSubscribers(); // Fetch ACTIVE subscribers from 'hive_clients' table

    // Populate the 'Select Subscriber' dropdown button from the retrieved ACTIVE subscribers
    dropdownSubscriberOptions.value = activeSubscribers.map(
      (activeSubscriber) => ({
        label: activeSubscriber.subscriberAccountNumber,
        value: `${activeSubscriber.id}`,
      })
    );
  } catch (error) {
    console.error("Error fetching active subscribers: ", error);
    throw error;
  }
};

// Function to fetch ONU and OLT info from Prometheus
const getInfoApiPrometheus = async (acctNumber: string) => {
  try {
    donePrometheusCall.value = false; // Flag for when displaying Grafana

    console.log(`Passed Account Number to getInfoApiPrometheus: ${acctNumber}`);

    // Fetch subscriber's ONU data from Prometheus through API call
    const onuPrometheusResponse = await axios.get(
      `${prometheusApi}/api/v1/query?query=lo_status{job="subscriber",site_tenant="DATACONNECT",account_number="${acctNumber}"}`
    );
    console.log("Returned response from Prometheus: ", onuPrometheusResponse);

    // Check if ONU has data in Prometheus based on API call response
    if (onuPrometheusResponse.data.data.result.length > 0) {
      onuInfo.value = onuPrometheusResponse.data.data.result[0].metric;
    } else {
      console.warn("No ONU Data Found in Prometheus.");
    }
  } catch (error) {
    console.error("Error fetching data from Prometheus:", error);
    throw error;
  } finally {
    donePrometheusCall.value = true;
  }
  isLoading.value = false;
};

// Fetch subscribers when the component mounts
onMounted(async () => {
  await fetchActiveSubscribers(); // Call 'fetchActiveSubscribers' function for fetching ACTIVE subscribers

  // Send frontend action log to backend for writing '.log' system file
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
.grafana-main {
  max-width: 1500px;
  margin: 0 auto;
}
.grafana {
  width: 100%;
}

.grafana-panel {
  width: 100%;
  aspect-ratio: 16 / 7;
  max-width: 1500px;
}

.select {
  max-width: 1500px;
  margin: 0 auto 15px auto;
  gap: 1em;
}
.my-cards {
  max-width: 1500px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}
.select-subscriber {
  width: 300px;
  margin-bottom: 10px;
}
.up {
  color: green;
}
.down {
  color: red;
}
</style>
