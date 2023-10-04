<template>
  <q-page>
    <q-dialog
      v-model.trim="store.$state.modalIsOpen"
    >
      <q-card>
        <!-- <q-card-section>
          <div class="text-h6">
            Subscriber
          </div>
        </q-card-section> -->

        <q-card-section class="flex-subscriber">
          <div class="">
            <q-input
              v-model.trim="accNo"
              outlined
              label="Account No."
              class="q-ma-md"
              disable
            />
            <q-input
              v-model.trim="subscriberName"
              outlined
              label="Subscriber Name"
              class="q-ma-md"
              disable
            />
            <q-input
              v-model.trim="packageType"
              outlined
              label="Package Type"
              class="q-ma-md"
              disable
            />
            <q-input
              v-model.trim="serialNum"
              outlined
              label="Serial Number"
              class="q-ma-md"
            />
            <q-select
              v-model.trim="oltIp"
              filled
              :options="['172.16.0.2', '172.16.0.58','172.16.0.22']"
              label="OLT IP"
              class="q-ma-md"
            />
          </div>
          <div class="">
            <q-select
              v-model.trim="oltInterface"
              filled
              :options="oltInterfaceOptions"
              label="OLT Interface"
              class="q-ma-md"
            />

            <q-field
              filled
              label="Mode"
              stack-label
              class="q-ma-md"
            >
              <template #control>
                <div class="q-gutter-sm">
                  <q-radio
                    v-model.trim="mode"
                    dense
                    val="Bridged"
                    label="Bridged"
                  />
                  <q-radio
                    v-model.trim="mode"
                    dense
                    val="Routed"
                    label="Routed"
                  />
                </div>
              </template>
            </q-field>
            <q-input
              v-model.trim="ssidNi"

              outlined
              class="q-ma-md"
              label="SSID"
            />
            <q-input
              v-model.trim="passwordNi"
              outlined
              class="q-ma-md"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
            >
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn
            flat
            label="Update Info"
            color="secondary"
            @click="updateDetails(dataId)"
          />
          <q-btn
            flat
            label="Close"
            color="primary"
            @click="onClose"
          />
        </q-card-actions>
        <q-banner class="bg-primary text-white">
          Subscriber Details: {{ responseMsg.subscriber }} <br>
          SSID/Password Config: {{ responseMsg.configureSsid }} <br>
          Wan Config: {{ responseMsg.wanConfig }} <br>
          Bandwidth: {{ responseMsg.setBandwidth }} <br>
          Playbook: {{ responseMsg.runAnsible }} <br>
        </q-banner>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">

import { ref, watchEffect, reactive, defineProps, toRefs } from 'vue'
import { useSubscriberStore } from '../../stores/subscriber/subscriber-store'
import axios from 'axios'

axios.defaults.timeout = 0
const store = useSubscriberStore()
const props = defineProps(['dataId', 'getSubsribers'])
const { dataId } = toRefs(props)
const accNo = ref('')
const subscriberName = ref('')
const packageType = ref('')
const serialNum = ref('')
const oltIp = ref('')
const oltInterface = ref('')
const mode = ref('')
const ssidNi = ref('')
const passwordNi = ref('')
const isPwd = ref(true)
const responseMsg = reactive({
  subscriber: '',
  configureSsid: '',
  setBandwidth: '',
  runAnsible: '',
  wanConfig: ''
})

watchEffect(() => {
  accNo.value = store.$state.subscriberDetail.acc_no
  subscriberName.value = store.$state.subscriberDetail.subscriber_name
  packageType.value = store.$state.subscriberDetail.package_type
  serialNum.value = store.$state.subscriberDetail.serial_number
  oltIp.value = store.$state.subscriberDetail.olt_ip
  oltInterface.value = store.$state.subscriberDetail.olt_interface
  mode.value = store.$state.subscriberDetail.mode
  ssidNi.value = store.$state.subscriberDetail.ssid
  passwordNi.value = store.$state.subscriberDetail.password
})

const oltInterfaceOptions = ['0/1:1', '0/1:2', '0/1:3', '0/2:1', '0/2:2', '0/2:3', '0/3:1', '0/3:2', '0/3:3']
const hostIp = 'http://127.0.0.1:8000'
const acsIp = 'http://192.168.250.11:7547'
const serverIp = 'http://172.91.10.108:8080'
const onClose = () => {
  store.$state.modalIsOpen = !store.$state.modalIsOpen
}

const updateDetails = async (id: string) => {
  // this is to update the subscriber/client info
  await axios.put(`${hostIp}/api/subscriber_test/${id}/edit`, {
    acc_no: accNo.value,
    subscriber_name: subscriberName.value,
    serial_number: serialNum.value,
    olt_ip: oltIp.value,
    olt_interface: oltInterface.value,
    package_type: packageType.value,
    mode: mode.value,
    ssid: ssidNi.value,
    password: passwordNi.value
  }).then(response => {
    responseMsg.subscriber = response.data
    props.getSubsribers()
  }).catch((error) => {
    responseMsg.subscriber = error
  })
  // this is to configure SSID and Password

  await axios
    .post(`${acsIp}/configureSSID`, {

      SN: serialNum.value,
      NewSSID: mode.value === 'Bridged' ? '' : ssidNi.value,
      Password: passwordNi.value

    })
    .then((response) => {
      responseMsg.configureSsid = response.data
    })
    .catch((error) => {
      responseMsg.configureSsid = error
    })
    // this is for wan configuration
  await axios
    .post(`${acsIp}/bridgedWanConfig`, {
      SN: serialNum.value
    })
    .then((response) => {
      responseMsg.wanConfig = response.data
    })
    .catch((error) => {
      responseMsg.wanConfig = error
    })
    // this is for setting up bandwidth
  await axios.post(serverIp + '/setBandwidth').then((response) => {
    if (response.data) {
      responseMsg.setBandwidth = 'Bandwidth Config Success!'
    } else {
      throw new Error('Something went wrong!')
    }
  }).catch(err => {
    responseMsg.setBandwidth = err
  })
  // this is for executing api call to run an ansible script
  await axios.post(serverIp + '/runPlaybook').then((response) => {
    if (response.data) {
      responseMsg.runAnsible = 'Successfull Setup!'
    } else {
      throw new Error('Something went wrong!')
    }
  }).catch(err => {
    responseMsg.runAnsible = err
  })
}
</script>

<style lang="scss" scoped>
.flex-subscriber {
  min-width: 350px;

}

@media screen and (min-width: 660px){
  .flex-subscriber {
  width: 100%;
  display: flex;
}
}
</style>
