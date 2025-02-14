<template>
  <q-page padding>
    <q-ajax-bar color="secondary" position="bottom"></q-ajax-bar>
    <div class="select">
      <q-select
        v-model="selectSubscriber"
        :options="selectOptions"
        label="Select Subscriber"
        filled
        class="select-subscriber"
        emit-value
        map-options
        @update:model-value="fetchClientInfo($event)"
      />
      <q-select
        v-model="selectTime"
        :options="timeOptions"
        label="Select Time"
        filled
        class="select-subscriber"
        emit-value
        map-options
      />
      <q-btn
        icon="autorenew"
        class="cursor-pointer q-mx-sm"
        @click="fetchClientInfo(selectSubscriber)"
        flat
      />
    </div>

    <div class="my-cards">
      <q-card>
        <q-banner class="bg-primary text-white"> Client Details </q-banner>
        <q-card-section>
          <p>Client Name: {{ clientInfo.clientName }}</p>
          <p>Account Number: {{ clientInfo.accountNumber }}</p>
          <p>Package Type: {{ clientInfo.packageType }}</p>
        </q-card-section>
      </q-card>
      <q-card>
        <q-banner class="bg-primary text-white"> ONU Details </q-banner>
        <q-card-section>
          <p>
            ONU Status:
            <span
              v-if="selectSubscriber !== ''"
              :class="onuStatus === '1' ? 'up' : 'down'"
            >
              {{ onuStatus === "1" ? "Online" : "Offline" }}
            </span>
          </p>
          <p>
            ONU IP: <span>{{ onuInfo.instance }}</span>
          </p>
          <p>ONU Serial Number: {{ clientInfo.onuSerialNumber }}</p>
          <p>ONU Mac Address: {{ clientInfo.onuMacAddress }}</p>
          <p>
            Upstream: {{ bandwidth.upStream }} Downstream:
            {{ bandwidth.downStream }}
          </p>
        </q-card-section>
      </q-card>
      <q-card>
        <q-banner class="bg-primary text-white"> OLT Details </q-banner>
        <q-card-section>
          <p>
            OLT Status:
            <span
              v-if="selectSubscriber !== ''"
              :class="oltStatus === '1' ? 'up' : 'down'"
            >
              {{ oltStatus === "1" ? "Online" : "Offline" }}
            </span>
          </p>
          <p>
            OLT IP: <span>{{ clientInfo.oltIp }}</span>
          </p>
          <p>OLT Site: {{ onuInfo.site_name }}</p>
          <p>OLT Interface: {{ clientInfo.oltInterface }}</p>
        </q-card-section>
      </q-card>
    </div>
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
    <!-- <div class="grafana-main">
      <div class="grafana" v-if="!doneApiCalls">
        <div>
          <iframe
            :src="`${grafanaApi}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectTime}&to=now&var-Subscriber=${selectSubscriber}&panelId=3`"
            class="grafana-panel"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div> -->
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { getHiveclients } from "src/api/HiveConnectApis/hiveConnect"; // Ensure this is correctly imported

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
