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
            Client data with their assigned devices (ONU & OLT)<br />
            and its traffic details for troubleshooting.
          </p>
        </div>

        <!-- Select filter fields here -->
        <div class="flex flex-row-reverse w-full">
          <!-- Dropdown button here -->
          <div class="flex flex-row q-gutter-x-md items-center">
            <!-- Refresh button here -->
            <q-icon flat name="autorenew" size="sm" />

            <!-- Select time dropdown button here -->
            <!-- <DropdownButton
              @select="handleSelectTime"
              :columnOptions="timeOptions"
              label="Select Time"
            /> -->

            <DropdownButton
              @select="handleSelectSubscriber"
              :columnOptions="selectOptions"
              label="Select Subscriber"
            />
          </div>
        </div>

        <!-- Content container here -->
        <div class="full-width">
          <!-- Client details card -->
          <!-- TODO: check the 'packageType' variable since it seems that it hasn't been defined -->
          <!-- <Card
            header="Client Details"
            :details="[
              { label: 'Client Name', value: clientInfo.clientName },
              { label: 'Account Number', value: clientInfo.accountNumber },
              { label: 'Package Type', value: clientInfo.packageType },
            ]"
          /> -->

          <!-- ONU details card -->
          <Card
            header="ONU Details"
            :details="[
              {
                label: 'ONU Status',
                value: onuStatus === '1' ? 'Online' : 'Offline',
              },
              { label: 'ONU IP', value: onuInfo.instance },
              { label: 'ONU Serial Number', value: clientInfo.onuSerialNumber },
              { label: 'ONU Mac Address', value: clientInfo.onuMacAddress },
              { label: 'Upstream', value: bandwidth.upStream },
              { label: 'Downstream', value: bandwidth.downStream },
            ]"
          />

          <!-- OLT details card -->
          <Card
            header="OLT Details"
            :details="[
              {
                label: 'OLT Status',
                value: oltStatus === '1' ? 'Online' : 'Offline',
              },
              { label: 'OLT IP', value: clientInfo.oltIp },
              { label: 'OLT Site', value: onuInfo.site_name },
              { label: 'OLT Interface', value: clientInfo.oltInterface },
            ]"
          />

          <!-- Grafana panel -->
          <div class="grafana-main">
            <div class="grafana">
              <iframe
                v-if="doneApiCalls"
                :src="`${grafanaApi}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectTime}&to=now&var-Subscriber=${selectSubscriber}&panelId=3`"
                class="grafana-panel"
                frameborder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { getHiveclients } from "src/api/HiveConnectApis/hiveConnect"; // Ensure this is correctly imported

import DropdownButton from "src/components/DropdownButton.vue";
import ListView from "src/components/ListView.vue";
import Card from "src/components/Card.vue";

const selectSubscriber = ref("");
const selectOptions = ref<{ label: string; value: string }[]>([]);
const doneApiCalls = ref(false);
const selectTime = ref("2d");

const onuInfo = ref({
  instance: "",
  site_name: "",
});
const onuStatus = ref("");
const oltStatus = ref("");
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const grafanaApi = process.env.PROVISION_API_GRAFANA;
const timeOptions = [
  { label: "No Evaluation Time", value: null },
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

const clientInfo = reactive({
  accountNumber: "",
  clientName: "",
  onuSerialNumber: "",
  oltIp: "",
  onuMacAddress: "",
  oltSite: "",
  oltInterface: "",
});

const bandwidth = reactive({
  upStream: "",
  downStream: "",
});

// Fetch subscribers to populate the dropdown
const fetchSubscribers = async () => {
  try {
    const clients = await getHiveclients();
    selectOptions.value = clients.map((client) => ({
      label: `${client.onuDeviceName}-${client.ipAssigned}`,
      value: `${client.onuDeviceName}-${client.ipAssigned}`,
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};

// Function to fetch client data based on selected subscriber
const fetchClientInfo = async (deviceName: string) => {
  if (!deviceName) return; // Ensure a device is selected

  // Logic to find selected client from the options
  const selectedClient = selectOptions.value.find(
    (client) => client.value === deviceName
  );

  if (selectedClient) {
    const [deviceNamePart, ipAssignedPart] = selectedClient.value.split("-");

    // Fetch other client info based on selected device name
    try {
      const clientData = await getHiveclients();
      const client = clientData.find(
        (client) =>
          client.onuDeviceName === deviceNamePart &&
          client.ipAssigned === ipAssignedPart
      );

      if (client) {
        Object.assign(clientInfo, {
          accountNumber: client.subscriberAccountNumber,
          clientName: client.clientName,
          onuSerialNumber: client.onuSerialNumber,
          oltIp: client.oltIp,
          onuMacAddress: client.onuMacAddress,
          //oltSite: client.oltSite,
          oltInterface: client.oltInterface,
          packageType: client.packageType,
        });

        // Fetch ONU and OLT info from Prometheus
        // await getInfoApiPrometheus(client.onuDeviceName);
        // Fetch ONU and OLT info from Prometheus using the new format
        await getInfoApiPrometheus(
          `${client.onuDeviceName}-${client.ipAssigned}`
        );
      }
    } catch (error) {
      console.error("Error fetching client info:", error);
    }
  }
};

// Function to fetch ONU and OLT info from Prometheus
const getInfoApiPrometheus = async (deviceName: string) => {
  doneApiCalls.value = false;
  try {
    const onuResponse = await axios.get(
      `${prometheusApi}/api/v1/query?query=lo_status{job="ip_address",site_tenant="DCTECH",device_name="${deviceName}"}`
    );

    if (onuResponse.data.data.result.length > 0) {
      onuInfo.value = onuResponse.data.data.result[0].metric;
      onuStatus.value = onuResponse.data.data.result[0].value[1];

      const oltResponse = await axios.get(
        `${prometheusApi}/api/v1/query?query=lo_status{job="ip_address",site_tenant="DCTECH",device_name="${onuInfo.value.site_name}"}`
      );

      if (oltResponse.data.data.result.length > 0) {
        oltStatus.value = oltResponse.data.data.result[0].value[1];
      }
    } else {
      console.warn("No ONU data found");
    }
  } catch (error) {
    console.error("Error fetching data from Prometheus:", error);
  } finally {
    doneApiCalls.value = true;
  }
};

// Fetch subscribers when the component mounts
onMounted(() => {
  fetchSubscribers();
});

// <------- TEST RESKIN -----------

const handleSelectTime = (selectedTime: string[]) => {
  console.log("Selected Time: ", selectedTime);
};

const handleSelectSubscriber = (selectedSubscriber: string[]) => {
  console.log("Selected Subscriber: ", selectSubscriber);
};

const troubleshootHeaders = [
  {
    name: "clientName",
    label: "Client Name",
  },
  {
    name: "accountNumber",
    label: "Account Number",
  },
  {
    name: "packageType",
    label: "Package Type",
  },
  {
    name: "onuStatus",
    label: "ONU Status",
  },
];

const troubleshootItems = [
  {
    externalKey: 2,
    clientName: "Test",
    accountNumber: "123456789",
    packageType: "PLAN999",
    onuStatus: "Online",
  },
  {
    externalKey: 2,
    clientName: "Test",
    accountNumber: "123456789",
    packageType: "PLAN999",
    onuStatus: "Online",
  },
];

// ------------------------------- >
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
