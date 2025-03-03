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

        <div class="flex flex-row items-center">
          <!-- TODO: add @click event -->
          <Buttons
            icon="img:/icons/pen.svg"
            label="Auto Config"
            color="bg-gray-iron-100"
            textColor="text-gray-iron-900"
            small
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

          <div class="grid grid-cols-3 gap-4">
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
            <div class="flex flex-col mb-8">
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

          <!-- <q-icon flat name="autorenew" size="sm" class="cursor-pointer" /> -->

          <!-- TODO: change color style of this button & add @click event -->
          <!-- TODO: change this into dropdown button instead of buttons component -->
          <DropdownButton
            :modelValue="selectTime"
            :columnOptions="timeOptions"
            label="Select time"
            color="bg-primary-600"
            textColor="text-white"
          />
        </div>

        <!-- TODO: add v-if: doneApiCalls -->
        <Card
          header="Subscriber Details"
          :details="[
            { label: 'Subscriber Name', value: clientInfo.clientName },
            { label: 'Account Number', value: clientInfo.accountNumber },
            { label: 'Payment Status', value: clientInfo.otcStatus },
            { label: 'Package Type', value: bandwidth.name },
          ]"
        />

        <!-- ONU Details Card -->
        <!-- TODO: add v-if done api calls -->
        <Card
          header="ONU Details"
          :details="[
            {
              label: 'ONU Status',
              value: onuStatus === '1' ? 'Online' : 'Offline',
            },
            { label: 'ONU IP', value: clientInfo.ipAssigned },
            { label: 'SSID', value: clientInfo.SSID },
            { label: 'ONU Serial Number', value: clientInfo.onuSerialNumber },
            {
              label: 'ONU Mac Address',
              value: clientInfo.onuMacAddress,
            },
            { label: 'Upstream', value: bandwidth.upStream },
            {
              label: 'Downstream',
              value: bandwidth.downStream,
            },
          ]"
        />

        <!-- OLT Details Card -->
        <!-- TODO: add v-if doneApiCalls -->
        <Card
          header="OLT Details"
          :details="[
            {
              label: 'OLT Status',
              value: oltStatus === '1' ? 'Online' : 'Offline',
            },
            { label: 'OLT IP', value: clientInfo.oltIp },
            { label: 'OLT Site', value: clientInfo.oltSite },
            { label: 'OLT Interface', value: clientInfo.oltInterface },
            { label: 'OLT Upstream', value: clientInfo.oltUpstream },
            { label: 'OLT Downstream', value: clientInfo.oltDownstream },
          ]"
        />

        <!-- Grafana Panel -->
        <div class="mt-6">
          <iframe
            :src="`${grafanaApi}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${selectTime}&to=now&var-Subscriber=${deviceName}&panelId=3`"
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
import { useQuasar } from "quasar";
import { toRefs, ref, reactive, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import {
  getHiveClientById,
  checkOltSiteByIp,
  checkPackageDetails,
  getOtcStatus,
} from "src/api/HiveConnectApis/hiveConnect";
import { toInitialCapital } from "src/util/string";
import Inputs from "../inputs/Inputs.vue";
import Card from "../Card.vue";
import DropdownButton from "../DropdownButton.vue";
import StatusBadge from "../StatusBadge.vue";
import Buttons from "../inputs/Buttons.vue";

const router = useRouter();
const route = useRoute();
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
const localIsVisible = ref(props.isVisible);
const selectTime = ref("2d");
const onuStatus = ref("");
const oltStatus = ref("");
const subscriberAccountNo = route.params.accountNo;
const provisionedSubscriberData = ref(
  (router.options.history.state as { provisionedSubscriberData?: any })
    ?.provisionedSubscriberData || {}
);
const prometheusApi = process.env.PROVISION_API_PROMETHEUS;
const grafanaApi = process.env.PROVISION_API_GRAFANA;

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

const goBack = () => {
  router.push({ name: "provisioned" });
};

const getInfoApiPrometheus = async (deviceName: string, id: number) => {
  console.log(deviceName);
  $q.loading.show();

  try {
    if (!deviceName) {
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
  }
  $q.loading.hide();
};

watch(isVisible, () => {
  if (isVisible.value === true) {
    getInfoApiPrometheus(props.deviceName, props.clientId);
  }
});

onMounted(() => {
  if (provisionedSubscriberData.value) {
    console.log(
      "Data received from Active/Onhold Subscribers Page: ",
      provisionedSubscriberData.value
    );
  }
});
</script>

<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

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
