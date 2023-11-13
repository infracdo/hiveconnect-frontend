<template>
  <q-page>
    <q-ajax-bar
      ref="bar"
      color="info"
      position="bottom"
      size="10px"
      skip-hijack
    />
    <q-dialog
      v-model="confirm"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="dialog-content" v-if="doneApiCalls">
        <div class="provision-info">
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
              <p>
                ONU Status:
                <span
                  :style="onuStatus === '1' ? 'color: green' : 'color: red'"
                  >{{ onuStatus === "1" ? "UP" : "Down" }}</span
                >
              </p>
              <p>ONU IP: {{ clientInfo.ipAssigned }}</p>
              <p>ONU Serial Number: {{ clientInfo.onuSerialNumber }}</p>
              <p>ONU Mac Address: {{ clientInfo.onuMacAddress }}</p>
              <p>
                upstream:
                {{ bandwidth.upStream }} kbps <br />
                downstream: {{ bandwidth.downStream }} kbps
              </p>
            </q-card-section></q-card
          >
          <q-card>
            <q-banner class="bg-primary text-white"> OLT Details </q-banner>
            <q-card-section>
              <p>
                OLT Status:
                <span
                  :style="oltStatus === '1' ? 'color: green' : 'color: red'"
                >
                  {{ oltStatus === "1" ? "UP" : "Down" }}</span
                >
              </p>
              <p>
                OLT IP:
                {{ clientInfo.oltIp }}
              </p>
              <p>OLT Site: {{ clientInfo.oltSite }}</p>
              <p>OLT Interface: {{ clientInfo.oltInterface }}</p>
            </q-card-section>
          </q-card>
        </div>
        <q-select
          v-model="selectTime"
          :options="timeOptions"
          label="Select Time"
          filled
          class="select-time q-py-md"
          emit-value
          map-options />
        <iframe
          :src="`http://172.91.0.174:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectTime}&to=now&var-Subscriber=${deviceName}&panelId=3`"
          class="grafana-panel"
          frameborder="0"
        ></iframe>
        <q-card-actions vertical align="right">
          <q-btn
            filled
            label="Close"
            color="red"
            @click="closeModalNow"
          /> </q-card-actions
      ></q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { toRefs, ref, reactive, watch } from "vue";
import axios from "axios";
import {
  getClientById,
  checkOltInterface,
  checkOltSiteByIp,
  checkPackageBandwidth,
} from "src/api/HiveConnectApis/hiveConnect";
import { useQuasar } from "quasar";
const $q = useQuasar();
const props = defineProps<{
  confirm: boolean;
  closeModal: Function;
  deviceName: string;
  clientId: number;
}>();
const doneApiCalls = ref(false);
const { confirm } = toRefs(props);

const closeModalNow = () => {
  props.closeModal();
};
const onuInfo = ref({
  __name__: "",
  device_name: "",
  device_role: "",
  instance: "",
  job: "",
  site_name: "",
  site_status: "",
  site_tenant: "",
  olt_ip: "",
});
const selectTime = ref("2d");
const onuStatus = ref("");
const oltStatus = ref("");
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

const showNotif = () => {
  $q.notify({
    message: "Gathering SNMP Data! Please wait for a moment.",
    color: "warning",
    position: "top",
  });
};

const getInfoApiPrometheus = async (deviceName: string, id: number) => {
  console.log(deviceName);
  $q.loading.show();

  try {
    if (!deviceName) {
      closeModalAndShowNotif();
      return;
    }

    // NETBOX
    const onuInfoResponse = await axios.get(
      `http://172.91.0.156:9090/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${deviceName}"}`
    );

    onuInfo.value = onuInfoResponse.data.data.result[0].metric;
    onuStatus.value = onuInfoResponse.data.data.result[0].value[1];

    const OltDeviceName = onuInfo.value.olt_ip;
    // NETBOX
    const oltInfoResponse = await axios.get(
      `http://172.91.0.156:9090/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="OLT-${OltDeviceName}"}`
    );
    console.log(OltDeviceName);

    oltStatus.value = oltInfoResponse.data.data.result[0].value[1];

    const {
      accountNumber,
      clientName,
      ipAssigned,
      onuSerialNumber,
      oltInterface,
      oltIp,
      onuDeviceName,
      onuMacAddress,
      packageTypeId,
      ssidName,
      ssidPw,
    } = await getClientById(id);

    clientInfo.accountNumber = accountNumber;
    clientInfo.clientName = clientName;
    clientInfo.ipAssigned = ipAssigned;
    clientInfo.oltIp = oltIp;
    clientInfo.oltInterface = oltInterface;
    clientInfo.onuDeviceName = onuDeviceName;
    clientInfo.onuMacAddress = onuMacAddress;
    clientInfo.onuSerialNumber = onuSerialNumber;
    clientInfo.packageTypeId = packageTypeId;

    try {
      const oltSitePo = await checkOltSiteByIp(clientInfo.oltIp);
      clientInfo.oltSite = oltSitePo.olt_name;
      const responsePo = await checkPackageBandwidth(packageTypeId);
      const { upstream, downstream } = responsePo;

      bandwidth.upStream = upstream;
      bandwidth.downStream = downstream;
    } catch (err) {
      throw err;
    }

    doneApiCalls.value = true;
  } catch (err) {
    console.log(err);
    closeModalAndShowNotif();
  }
  $q.loading.hide();
};

const closeModalAndShowNotif = () => {
  closeModalNow();
  showNotif();
};

watch(confirm, () => {
  if (confirm.value === true) {
    getInfoApiPrometheus(props.deviceName, props.clientId);
  }
});
</script>

<style scoped>
.provision-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1em;
}
.dialog-content {
  max-width: 1200px;
  width: 100%;
  padding: 1em;
}
.grafana-panel {
  width: 100%;
  aspect-ratio: 16 / 7;
  max-width: 1200px;
}
.select-time {
  max-width: 200px;
}

@media screen and (min-width: 690px) {
  .provision-info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1em;
  }
  .grafana-panel {
    aspect-ratio: 16 / 5;
    max-width: 1200px;
  }
}
</style>
src/api/HiveConnectApis/networkAddressAPIs
