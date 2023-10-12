<template>
  <q-page>
    <q-dialog v-model="isOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">For Provisioning</div>
        </q-card-section>

        <q-card-section class="q-pt-none flex-client">
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
          <q-input
            v-model="NewClient.ipAssign"
            filled
            label="IP Assign"
            readonly
          >
            <template #append>
              <q-icon name="add" class="cursor-pointer" @click="assignIp" />
            </template>
          </q-input>
          <q-input
            v-model="NewClient.packageType"
            filled
            label="Package Type"
            readonly
          />
          <q-select
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
          />
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
            :options="optionsOltIp"
            label="OLT"
            emit-value
            map-options
          />
          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" @click="provisionClient" />
            <q-btn flat label="close" color="primary" @click="kapoyNako" />
          </q-card-actions>
        </q-card-section>
        <q-banner class="bg-primary text-white">
          Response: {{ responseMsg }}
        </q-banner>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import {
  defineProps,
  toRefs,
  reactive,
  ref,
  watchEffect,
  onMounted,
  onUpdated,
  watch,
} from 'vue';
import {
  updateClient,
  getOneAvailableIpAddress,
  executeProvision,
} from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs';
import { IsubsriberType, IserialAndMac } from '../../components/models';

const props = defineProps<{
  isOpen: boolean;
  serialAndMac: IserialAndMac[];
  client: IsubsriberType;
  closeModal: Function;
}>();
const { isOpen } = toRefs(props);
const onChange = ref('');
const kapoyNako = () => {
  props.closeModal();
};
const optionsOltIp = [
  { label: 'Gusa 1', value: '172.16.0.2' },
  { label: 'Gusa 2', value: '172.16.0.10' },
];

const responseMsg = ref('');

const NewClient = reactive({
  clientId: 0,
  accountNumber: '',
  packageType: '',
  serialAndMac: {
    serialNum: {
      label: '',
      idx: 0,
    },
    macAddress: '',
  },
  oltIp: '',
  ipAssign: '',
  clientName: '',
});
onUpdated(() => {
  NewClient.serialAndMac.serialNum.label = props.client?.onuSerialNumber;
  NewClient.serialAndMac.macAddress = props.client?.onuMacAddress;
});
watchEffect(() => {
  NewClient.clientId = props.client?.id;
  NewClient.accountNumber = props.client?.accountNumber;
  NewClient.clientName = props.client?.clientName;
  NewClient.ipAssign = props.client?.ipAssigned;
  NewClient.oltIp = props.client?.oltIp;
  NewClient.packageType = props.client?.packageTypeId;
});

const provisionClient = async () => {
  console.log(NewClient);

  try {
    const response = await updateClient(
      NewClient.clientId,
      NewClient.ipAssign,
      NewClient.serialAndMac.serialNum.label,
      NewClient.oltIp,
      NewClient.serialAndMac.macAddress
    );
    if (response) {
      responseMsg.value = 'Successfull Client Update!';
    }
  } catch (error) {
    responseMsg.value = 'Unsuccessful client Update: ' + error;
  }

  try {
    const response = await executeProvision(
      NewClient.accountNumber,
      NewClient.clientName,
      NewClient.serialAndMac.serialNum.label,
      NewClient.serialAndMac.macAddress,
      NewClient.ipAssign,
      NewClient.oltIp,
      NewClient.packageType
    );
    responseMsg.value = response;
  } catch (error) {
    throw new Error('Provoision Not complete');
  }
};

const assignIp = async () => {
  const [IpNetwork] = await getOneAvailableIpAddress();
  const { ipAddress } = IpNetwork;
  NewClient.ipAssign = ipAddress;
};

const assignMac = () => {
  NewClient.serialAndMac.macAddress =
    props.serialAndMac[NewClient.serialAndMac.serialNum.idx].mac_address;
};
</script>

<style scoped>
.flex-client {
  /* min-width: 350px; */
  /* width: 100%; */

  gap: 1em;
}

@media screen and (min-width: 660px) {
  .flex-client {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .q-banner {
    width: 100%;
    max-width: inherit;
  }
}
</style>
