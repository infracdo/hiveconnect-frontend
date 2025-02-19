<template>
  <q-ajax-bar
    ref="bar"
    color="info"
    position="bottom"
    size="10px"
    skip-hijack
  />
  <q-dialog
    v-model="localIsVisible"
    persistent
    class="rounded-lg"
    position="right"
  >
    <q-card
      v-if="doneApiCalls"
      class="px-6 pb-6 dialog-content"
      style="
        width: 600px;
        max-width: 100%;
        height: 500px;
        max-height: 100%;
        display: flex;
        flex-direction: column;
      "
    >
      <div style="flex: 1; display: flex; flex-direction: column">
        <!-- Modal title -->
        <div
          style="z-index: 2"
          class="text-lg font-semibold row items-center justify-center no-wrap bg-white h-[52px] pt-4 sticky"
        >
          <span> Troubleshoot Client </span>
        </div>

        <q-card-section class="mt-4 p-0" style="z-index: 1">
          <!-- Client details section-->
          <div class="mb-4">
            <p class="mb-2 text-gray-iron-900 font-semibold">Client Details</p>
            <div class="mb-4" style="display: flex; gap: 16px">
              <!-- Client Name input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.clientName"
                label="Client Name"
                readonly
              />

              <!-- Account Number input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.accountNumber"
                label="Account Number"
                readonly
              />

              <!-- Payment Status input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.otcStatus"
                label="Payment Status"
                readonly
              />

              <!-- Package Type input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="bandwidth.name"
                label="Package Type"
                readonly
              />
            </div>
          </div>

          <!-- ONU Details Section -->
          <div class="mb-4">
            <div class="mb-2 text-gray-iron-900 font-semibold">ONU Details</div>
            <div class="mb-2" style="display: flex; gap: 16px">
              <!-- ONU Status input field-->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                :v-model="onuStatus === '1' ? 'Online' : 'Offline'"
                label="ONU Status"
                readonly
              />

              <!-- ONU IP input field-->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.ipAssigned"
                label="ONU IP"
                readonly
              />

              <!-- SSID Name input field-->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.SSID"
                label="SSID Name"
                readonly
              />

              <!-- ONU Serial Number select field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.onuSerialNumber"
                label="ONU Serial Number"
                readonly
              />
            </div>
            <div class="mb-2" style="display: flex; gap: 16px">
              <!-- ONU Mac Address input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.onuMacAddress"
                label="ONU Mac Address"
                readonly
              />

              <!-- Upstream input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="bandwidth.upStream"
                label="Upstream"
                readonly
              />

              <!-- Downstream input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="bandwidth.downStream"
                label="Downstream"
                readonly
              />
            </div>
          </div>

          <!-- OLT Details Section-->
          <div class="mb-4">
            <div class="mb-2 text-gray-iron-900 font-semibold">OLT Details</div>
            <div class="mb-2" style="display: flex; gap: 16px">
              <!-- OLT Status input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                :v-model="oltStatus === '1' ? 'Online' : 'Offline'"
                label="OLT Status"
                readonly
              />

              <!-- OLT IP input field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.oltIp"
                label="OLT IP"
                readonly
              />

              <!-- OLT Site select field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.oltSite"
                label="OLT Site"
                readonly
              />

              <!-- OLT Interface select field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.oltInterface"
                label="OLT Interface"
                readonly
              />

              <!-- OLT Upstream select field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.oltUpstream"
                label="OLT Upstream"
                readonly
              />

              <!-- OLT Downstream select field -->
              <Inputs
                :input-style="{ 'text-transform': 'uppercase' }"
                v-model="clientInfo.oltDownstream"
                label="OLT Downstream"
                readonly
              />
            </div>
          </div>
        </q-card-section>

        <q-select
          v-model="selectTime"
          :options="timeOptions"
          label="Select Time"
          filled
          class="select-time q-py-md"
          emit-value
          map-options
        />
        <iframe
          :src="`${grafanaApi}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectTime}&to=now&var-Subscriber=${deviceName}&panelId=3`"
          class="grafana-panel"
          frameborder="0"
        >
        </iframe>
        <q-card-actions vertical align="right">
          <q-btn filled label="Close" color="red" @click="closeModalNow" />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { toRefs, ref, reactive, watch } from "vue";
import axios from "axios";
import {
  getHiveClientById,
  checkOltSiteByIp,
  checkPackageDetails,
  getOtcStatus,
} from "src/api/HiveConnectApis/hiveConnect";
import { useQuasar } from "quasar";
import Inputs from "../inputs/Inputs.vue";

/////////////////
// Variables ///
//////////////////
const testmodal = ref(true);
const $q = useQuasar();
const props = defineProps<{
  isVisible: boolean;
  closeModal: Function;
  deviceName: string;
  clientId: number;
}>();
const doneApiCalls = ref(false);
const { isVisible } = toRefs(props);
// Tracks state of modal if visible or not
const localIsVisible = ref(props.isVisible);

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
  vlan_690_ip: "",
  provisioned_by: "",
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
  SSID: "",
  otcStatus: "",
  oltUpstream: 0,
  oltDownstream: 0,
});
const bandwidth = reactive({
  upStream: "",
  downStream: "",
  name: "",
});

////////////////
//// Methods ///
////////////////

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
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const grafanaApi = process.env.PROVISION_API_GRAFANA;
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

    //Prometheus
    const onuInfoResponse = await axios.get(
      `${prometheusApi}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${deviceName}"}`
    );
    console.log("ONU Prometheus: ", onuInfoResponse.data.data.result[0].metric);

    onuInfo.value = onuInfoResponse.data.data.result[0].metric;
    onuStatus.value = onuInfoResponse.data.data.result[0].value[1];

    const OltDeviceName = onuInfo.value.olt_ip;
    // Prometheus
    const oltInfoResponse = await axios.get(
      `${prometheusApi}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="OLT-${OltDeviceName}"}`
    );

    oltStatus.value = oltInfoResponse.data.data.result[0].value[1];

    const {
      subscriberAccountNumber,
      clientName,
      ipAssigned,
      onuSerialNumber,
      oltInterface,
      oltIp,
      onuDeviceName,
      onuMacAddress,
      packageType,
      ssidName,
      oltReportedDownstream,
      oltReportedUpstream,
    } = await getHiveClientById(id);

    const response = await getOtcStatus(id);
    // console.log(response);

    clientInfo.otcStatus = response;

    clientInfo.accountNumber = subscriberAccountNumber;
    clientInfo.clientName = clientName;
    clientInfo.ipAssigned = ipAssigned;
    clientInfo.oltIp = oltIp;
    clientInfo.SSID = ssidName;
    clientInfo.oltInterface = oltInterface;
    clientInfo.onuDeviceName = onuDeviceName;
    clientInfo.onuMacAddress = onuMacAddress;
    clientInfo.onuSerialNumber = onuSerialNumber;
    clientInfo.packageTypeId = packageType;
    clientInfo.oltUpstream = oltReportedUpstream;
    clientInfo.oltDownstream = oltReportedDownstream;
    console.log(oltReportedUpstream, oltReportedDownstream);

    try {
      const oltSitePo = await checkOltSiteByIp(clientInfo.oltIp);
      console.log(oltSitePo);

      clientInfo.oltSite = oltSitePo.oltName;
      const { upstream, downstream, name } = await checkPackageDetails(
        packageType
      );

      bandwidth.name = name;
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

// const emit = defineEmits<{
//   (event: "update:isVisible", value: boolean): void;
// }>();

// watch(
//   () => props.isVisible,
//   (newVal) => {
//     if (props.isVisible) {
//       localIsVisible.value = newVal;
//     }
//   }
// );

// watch(localIsVisible, (newVal) => {
//   emit("update:isVisible", newVal);
// });

const closeModalAndShowNotif = () => {
  closeModalNow();
  showNotif();
};

watch(isVisible, () => {
  if (isVisible.value === true) {
    getInfoApiPrometheus(props.deviceName, props.clientId);
  }
});
</script>

<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
.q-dialog .q-card {
  border-radius: 8px;
}
.dialog-content {
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.dialog-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
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
