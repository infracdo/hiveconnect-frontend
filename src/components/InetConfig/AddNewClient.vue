<template>
  <q-page>
    <q-dialog v-model="isOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Add New Client
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none flex-client">
          <q-input
            v-model="NewClient.accountNumber"
            outlined
            label="Account Number"
          />
          <q-input
            v-model="NewClient.ipAssign"
            outlined
            label="IP Assign"
          >
            <template #append>
              <q-icon
                name="add"
                class="cursor-pointer"
                @click="assignIp"
              />
            </template>
          </q-input>
          <q-input
            v-model="NewClient.packageType"

            outlined
            label="Package Type"
          />

          <q-input
            v-model="NewClient.onuSerialNum"
            outlined
            label="ONU Seriual Number"
          />
          <q-input
            v-model="NewClient.onuMacAddress"
            outlined
            label="Mac Address"
          />
          <q-input
            v-model="NewClient.oltIp"
            outlined
            label="OLT IP"
          />
          <q-card-actions align="right">
            <q-btn
              flat
              label="OK"
              color="primary"
              @click="addingOfClient"
            />
            <q-btn
              flat
              label="close"
              color="primary"
              @click="closeModal"
            />
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

import { defineProps, toRefs, defineEmits, reactive, ref } from 'vue'
import { addNewClient, getOneAvailableIpAddress, getClients } from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs'
const props = defineProps({ isOpen: Boolean })
const { isOpen } = toRefs(props)
const emit = defineEmits(['closeModal'])
const responseMsg = ref('')
const closeModal = () => {
  emit('closeModal')
}

const NewClient = reactive({
  accountNumber: '',
  packageType: '',
  onuSerialNum: '',
  onuMacAddress: '',
  oltIp: '',
  ipAssign: ''

})

const addingOfClient = async () => {
  try {
    const response = await addNewClient(NewClient.accountNumber, NewClient.oltIp, NewClient.onuSerialNum, NewClient.packageType, NewClient.onuMacAddress, NewClient.ipAssign)
    responseMsg.value = response.data
    NewClient.accountNumber = ''
    NewClient.packageType = ''
    NewClient.onuSerialNum = ''
    NewClient.onuMacAddress = ''
    NewClient.oltIp = ''
    NewClient.ipAssign = ''
    await getClients()
  } catch (error) {
    responseMsg.value = 'Unsuccessful client add: ' + error
  }
}

const assignIp = async () => {
  const [IpNetwork] = await getOneAvailableIpAddress()
  const { ipAddress } = IpNetwork
  NewClient.ipAssign = ipAddress
}
</script>

<style scoped>
.flex-client {
  min-width: 350px;

}

@media screen and (min-width: 660px){
  .flex-client {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.q-banner{
  width: 100%;
  max-width: 350px;
}
}
</style>
