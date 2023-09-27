<template>
  <q-page
    padding
    class="items-center justify-evenly"
  >
    <q-table
      :rows="tableRow"
      :title="`Rogue ${tableRow.length < 2 ? 'Device': 'Devices'}`"
      :columns="columns"
      row-key="id"
      :loading="tableRow.length > 0 ? false: true"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar'
// import axios from 'src/boot/axios'
import { IdeviceType } from '../components/models'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useDevicesStore } from 'src/stores/rogue-device/rogue-devices'

const store = useDevicesStore()
const tableRow = ref<IdeviceType[]>([])
const columns: QTableProps['columns'] = store.$state.devicesColumn
const getDevices = async () => {
  await axios.get('http://192.168.250.11:7547/getdevice').then((response) => {
    if (response) {
      tableRow.value = response.data
    } else {
      throw new Error('Could not retrieve data!')
    }
  })
}
onMounted(() => {
  getDevices()
})
</script>

<style scoped>

</style>
