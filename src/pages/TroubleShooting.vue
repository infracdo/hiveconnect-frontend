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
              { label: 'Subscriber Name', value: subscriberInfo.clientName },
              { label: 'Account Number', value: subscriberInfo.accountNumber },
              { label: 'Package Type', value: subscriberInfo.packageType },
            ]"
          />

          <!-- ONU details card -->
          <Card
            header="ONU Details"
            :details="[
              {
                label: 'ONU Status',
                value: selectedSubscriber
                  ? onuStatus === '1'
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
              { label: 'OLT Site', value: onuInfo.site_name },
              { label: 'OLT Interface', value: subscriberInfo.oltInterface },
            ]"
          />

          <!-- Grafana panel -->
          <div class="grafana-main">
            <div class="grafana">
              <iframe
                v-if="doneApiCalls"
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
} from "src/api/HiveConnectApis/hiveConnect"; // Ensure this is correctly imported
import { useKeycloak } from "src/composables/useKeycloak";
import DropdownButton from "src/components/DropdownButton.vue";
import Card from "src/components/Card.vue";

const route = useRoute();
const keycloak = useKeycloak();
const dropdownSubscriberOptions = ref<{ label: string; value: string }[]>([]);
const selectedSubscriber = ref("");
const selectedTime = ref("");
const onuStatus = ref<string | null>(null);
const oltStatus = ref<string | null>(null);
const doneApiCalls = ref(false);
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const grafanaApi = process.env.PROVISION_API_GRAFANA;

const onuInfo = ref({
  instance: "",
  site_name: "",
});

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

// Function to fetch the subscriber info based on the selected subscriber when the refresh icon button is clicked
const fetchSubscriberInfo = async (subscriberId: string) => {
  console.log("Passed Subscriber ID: ", subscriberId);
  if (!subscriberId) return; // Ensure a subscriber is selected

  if (subscriberId) {
    const numSubscriberId = Number(subscriberId);
    console.log(
      "Convert subscriber ID from string to number: ",
      numSubscriberId
    );

    // Fetch other client info based on selected device name
    try {
      const subscriberData = await getHiveClientById(numSubscriberId);
      console.log("Fetched selected subscriber info: ", subscriberData);

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

        // Fetch ONU and OLT info from Prometheus
        // await getInfoApiPrometheus(client.onuDeviceName);
        // Fetch ONU and OLT info from Prometheus using the new format
        await getInfoApiPrometheus(
          `${subscriberData.onuDeviceName}-${subscriberData.ipAssigned}`
        );
      }
    } catch (error) {
      console.error("Error fetching subscriber info:", error);
      throw error;
    }
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

  fetchSubscriberInfo(selectedSubscriber.value); // Fetch subscriber info based on the selected subscriber
};

// Fetch subscribers to populate the dropdown
const fetchActiveSubscribers = async () => {
  try {
    const activeSubscribers = await getHiveActiveSubscribers();
    dropdownSubscriberOptions.value = activeSubscribers.map(
      (activeSubscriber) => ({
        label: `${activeSubscriber.onuDeviceName}-${activeSubscriber.ipAssigned}`,
        value: `${activeSubscriber.id}`,
      })
    );
  } catch (error) {
    console.error("Error fetching active subscribers: ", error);
    throw error;
  }
};

// Function to fetch ONU and OLT info from Prometheus
const getInfoApiPrometheus = async (deviceName: string) => {
  doneApiCalls.value = false;
  try {
    const onuPrometheusResponse = await axios.get(
      `${prometheusApi}/api/v1/query?query=lo_status{job="ip_address",site_tenant="DCTECH",device_name="${deviceName}"}`
    );

    if (onuPrometheusResponse.data.data.result.length > 0) {
      onuInfo.value = onuPrometheusResponse.data.data.result[0].metric;
      onuStatus.value = onuPrometheusResponse.data.data.result[0].value[1];

      const oltPrometheusResponse = await axios.get(
        `${prometheusApi}/api/v1/query?query=lo_status{job="ip_address",site_tenant="DCTECH",device_name="${onuInfo.value.site_name}"}`
      );

      if (oltPrometheusResponse.data.data.result.length > 0) {
        oltStatus.value = oltPrometheusResponse.data.data.result[0].value[1];
      }
    } else {
      console.warn("No ONU data found");
    }
  } catch (error) {
    console.error("Error fetching data from Prometheus:", error);
    throw error;
  } finally {
    doneApiCalls.value = true;
  }
};

// Fetch subscribers when the component mounts
onMounted(async () => {
  await fetchActiveSubscribers();

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
