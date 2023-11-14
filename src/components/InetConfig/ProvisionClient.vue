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
          <!-- <q-input
            v-model="NewClient.ipAssign"
            filled
            label="IP Assign"
            readonly
          >
            <template #append>
              <q-icon name="add" class="cursor-pointer" @click="assignIp" />
            </template>
          </q-input> -->
          <q-input
            v-model="NewClient.packageType"
            filled
            label="Package Type"
            readonly
          />

          <q-input
            v-model="NewClient.serialAndMac.serialNum.label"
            label="Barcode Scan"
            outlined
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
          </q-input>
          <!-- <q-select
            outlined
            v-model="NewClient.serialAndMac.serialNum"
            :options="
              serialAndMac.map((item, index) => ({
                label: item.serial_number,
                idx: index,
              }))
            "
            label="ONU Seriual Number"
            @update:model-value="assignMac"
            :rules="[(val) => !!val || 'Field is required']"
            class="q-pa-none"
          /> -->
          <q-input
            v-model="NewClient.serialAndMac.macAddress"
            filled
            label="ONU Mac Address"
            readonly
          >
          </q-input>
          <q-select
            outlined
            v-model="NewClient.oltIp"
            :options="filteredOptions"
            label="OLT IP"
            clearable
            option-label="oltName"
            option-value="oltIp"
            input-debounce="0"
            use-input
            emit-value
            @filter="filterSelect"
          />
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
                ? 'OK'
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
        <q-img
          v-if="showSkeletonDancing"
          src="~assets/dance.gif"
          class="skeleton-dance"
        ></q-img>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { toRefs, reactive, ref, watchEffect, onUpdated, watch } from "vue";
import {
  executeAutoConfig,
  executeMonitoring,
  getAllOlts,
  testError,
  prepovisionCheck,
} from "src/api/HiveConnectApis/hiveConnect";
import { IsubsriberType, IserialAndMac } from "../models";
import { QrcodeStream } from "vue-qrcode-reader";
import { useQuasar } from "quasar";
import { IOlt } from "src/api/HiveConnectApis/types";

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
const scannerOptions = [
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "itf",
  "qr_code",
];
const optionsOltIp = ref<IOlt[]>([]);
const filteredOptions = ref<IOlt[]>([]);

const responses = reactive({
  autoConfig: "",
  monitoring: "",
});
const responseStatus = reactive({
  autoConfig: false,
  monitoring: false,
});

const result = ref("");
const NewClient = reactive({
  clientId: 0,
  accountNumber: "",
  packageType: "",
  serialAndMac: {
    serialNum: {
      label: "",
      idx: 0,
    },
    macAddress: "",
  },
  oltIp: "",
  clientName: "",
});
//////////////////////
////METHODS AREA/////
//////////////////////
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
    const response = await prepovisionCheck(
      NewClient.accountNumber,
      NewClient.clientName,
      NewClient.serialAndMac.serialNum.label,
      NewClient.serialAndMac.macAddress,
      NewClient.oltIp,
      NewClient.packageType
    );
    console.log(response.message);
  } catch (error) {
    console.log(error);
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
      NewClient.packageType
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
      NewClient.packageType
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

  showProvisionResult.value = true;
  stopProvisionFunction();
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
  optionsOltIp.value = await getAllOlts();
  console.log(optionsOltIp.value);
});
watchEffect(() => {
  NewClient.clientId = props.client?.id;
  NewClient.accountNumber = props.client?.accountNumber;
  NewClient.clientName = props.client?.clientName;
  NewClient.oltIp = props.client?.oltIp;
  NewClient.packageType = props.client?.packageTypeId;
});

watch(result, (newVal, oldVal) => {
  if (oldVal !== newVal) {
    openQRCamera.value = false;
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
