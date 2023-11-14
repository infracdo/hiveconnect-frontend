<template>
  <q-page padding>
    <q-ajax-bar color="secondary" position="bottom"></q-ajax-bar>
    <div class="select">
      <q-select
        v-model="selectSubscriber"
        :options="select"
        label="Select Subscriber"
        filled
        class="select-subscriber"
        map-option
        @update:model-value="getInfoApiPrometheus(selectSubscriber)"
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
        @click="ayy"
        flat
      />
    </div>
    <q-ajax-bar
      ref="bar"
      color="info"
      position="bottom"
      size="10px"
      skip-hijack
    />

    <div class="my-cards">
      <q-card>
        <q-banner class="bg-primary text-white"> Client Details </q-banner>
        <q-card-section>
          <p>Client Name: {{ clientInfo.clientName }}</p>
          <p>Account Number: {{ clientInfo.accountNumber }}</p>
          <p>Package Type: {{ clientInfo.packageTypeId }}</p>
        </q-card-section>
      </q-card>
      <q-card>
        <q-banner class="bg-primary text-white"> ONU Details </q-banner>
        <q-card-section>
          <p class="">
            ONU Status:
            <span
              v-if="selectSubscriber !== ''"
              :class="onuStatus === '1' ? 'up' : 'down'"
              >{{ onuStatus === "1" ? "UP" : "Down" }}</span
            >
          </p>
          <p class="">
            ONU IP:
            <span style="">{{ onuInfo.instance }}</span>
          </p>
          <p>ONU Serial Number: {{ clientInfo.onuSerialNumber }}</p>
          <p>ONU Mac Address: {{ clientInfo.onuMacAddress }}</p>
          <p>
            upstream: {{ bandwidth.upStream }} downstream:
            {{ bandwidth.downStream }}
          </p>
        </q-card-section></q-card
      >
      <q-card>
        <q-banner class="bg-primary text-white"> OLT Details </q-banner>
        <q-card-section>
          <p class="">
            OLT Status:
            <span
              v-if="selectSubscriber !== ''"
              :class="oltStatus === '1' ? 'up' : 'down'"
              >{{ oltStatus === "1" ? "UP" : "Down" }}</span
            >
          </p>
          <p class="">
            OLT IP:
            <span style="">{{ clientInfo.oltIp }}</span>
          </p>
          <p>OLT Site: {{ clientInfo.oltSite }}</p>
          <p>OLT Interface: {{ clientInfo.oltInterface }}</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="grafana-main">
      <div class="grafana" v-if="!doneApiCalls">
        <div>
          <iframe
            :src="`http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectTime}&to=now&var-Subscriber=${selectSubscriber}&panelId=3`"
            class="grafana-panel"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import {
  getClients,
  getClientById,
  checkOltSiteByIp,
} from "src/api/HiveConnectApis/hiveConnect";
import { IClient } from "src/api/HiveConnectApis/types";
const selectSubscriber = ref("");
const select = [
  "Stefani_Germanotta_bw1-100.126.0.3",
  "Mike_Stronghold_bw1-100.126.0.3",
  "Eef_Elsie_bw1-100.126.0.4",
];
const bar = ref<{
  start(): void;
  stop(): void;
}>();
const doneApiCalls = ref(false);
const selectTime = ref("2d");

const deviceNames = ref<{ onuDeviceName: string; id: number }[]>([]);
const onuInfo = ref({
  __name__: "",
  device_name: "",
  device_role: "",
  instance: "",
  job: "",
  site_name: "",
  site_status: "",
  site_tenant: "",
});
const onuStatus = ref("");
const oltStatus = ref("");
const grafanaApi = process.env.PROVISION_API_GRAFANA;
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const timeOptions = [
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
  ipAssigned: "",
  onuSerialNumber: "",
  oltIp: "",
  onuMacAddress: "",
  onuDeviceName: "",
  packageTypeId: "",
  oltSite: "",
  oltInterface: "",
});
const bandwidth = reactive({
  upStream: "",
  downStream: "",
});

const ayy = async () => {
  const clients: IClient[] = await getClients();
  deviceNames.value = clients
    .filter(
      (client: IClient) =>
        client.onuDeviceName !== null && client.onuDeviceName.trim() !== ""
    )
    .map((client: IClient) => ({
      onuDeviceName: client.onuDeviceName,
      id: client.id,
    }));
};

const getInfoApiPrometheus = async (deviceName: string) => {
  console.log(deviceName);
  doneApiCalls.value = false;
  const barRef = bar.value;
  barRef?.start();

  const response = await axios.get(
    `${grafanaApi}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${deviceName}"}`
  );

  onuInfo.value = response.data.data.result[0].metric;
  onuStatus.value = response.data.data.result[0].value[1];

  const oltInfo = await axios.get(
    `${prometheusApi}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${onuInfo.value.site_name}"}`
  );
  oltStatus.value = oltInfo.data.data.result[0].value[1];

  // const client = await getClientById(id);
  // const {
  //   accountNumber,
  //   clientName,
  //   ipAssigned,
  //   oltIp,
  //   onuDeviceName,
  //   onuMacAddress,
  //   onuSerialNumber,
  //   packageTypeId,
  // } = client;
  // clientInfo.accountNumber = accountNumber;
  // clientInfo.clientName = clientName;
  // clientInfo.ipAssigned = ipAssigned;
  // clientInfo.oltIp = oltIp;
  // clientInfo.onuDeviceName = onuDeviceName;
  // clientInfo.onuMacAddress = onuMacAddress;
  // clientInfo.onuSerialNumber = onuSerialNumber;
  // clientInfo.packageTypeId = packageTypeId;

  // const oltSitePo = await checkOltSiteByIp(oltIp);
  // const { olt_name } = oltSitePo;
  // clientInfo.oltSite = olt_name;

  // const responsePo = await checkPackageBandwidth(packageTypeId);
  // const { upstream, downstream } = responsePo;
  // bandwidth.upStream = upstream;
  // bandwidth.downStream = downstream;

  // const oltInterfaceResponse = await checkOltInterface(deviceName);
  // clientInfo.oltInterface = oltInterfaceResponse;
  barRef?.stop();
  doneApiCalls.value = true;
};

onMounted(() => {
  ayy();
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
  /* display: flex; */
  max-width: 1500px;
  margin: 0 auto 15px auto;
  gap: 1em;
}
.my-cards {
  max-width: 1500px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5em;
  margin: 0 auto 15px auto;
}
.select-subscriber {
  min-width: 200px;
}

.up {
  color: green;
}
.down {
  color: red;
}
@media screen and (min-width: 660px) {
  .grafana {
    display: grid;
    grid-template-columns: 1fr;

    gap: 1.5em;
  }
  .grafana-panel {
    aspect-ratio: 16 / 7;
    max-height: 450px;
  }
  .my-cards {
    grid-template-columns: 1fr 1fr;
  }
  .select {
    display: flex;
  }
}
@media screen and (min-width: 1200px) {
  .my-cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .grafana-panel {
    aspect-ratio: 21 / 6;
  }
}
</style>
