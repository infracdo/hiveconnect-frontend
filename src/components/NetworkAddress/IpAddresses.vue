<template>
  <q-page
    class="q-pt-md"
    padding
  >
    <q-table
      :filter="filter"
      :columns="columns"
      :rows="rows"
      class="text-center"
      :loading="rows && rows.length > 0 ? false: true"
      :pagination="{
        sortBy: 'ipAddress',
        rowsPerPage: 10
      }"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            icon="mode_edit"
            @click="console.log(props.row.id)"
          />
        </q-td>
      </template>
      <template #top>
        <q-btn
          color="primary"
          label="Back"
          to="/network-address"
        />
        <q-space />
        <q-input
          v-model="filter"
          filled
          dense
          debounce="300"
          color="primary"
          label="Search"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { useIpAddressStore } from '../../stores/network-address/ip-address'
// import { useNetworkStore } from 'src/stores/network-address/network-address'
import axios from 'axios'
import { ref, watchEffect, defineProps, onMounted } from 'vue'
import { IrowIpAddress } from '../models'
import { useRoute } from 'vue-router'
// import { getIpAddresses } from '../../api/RestAPIs'
const route = useRoute()
const storeIp = useIpAddressStore()

const columns = storeIp.$state.ipAddressColumn
const ipAddress = route.params.ipAddress
const rows = ref<IrowIpAddress[]>()
const filter = ref('')

// rows.value = getIpAddresses(ipAddress)
const getIpAddresses = async () => {
  try {
    if (ipAddress !== '') {
      const response = await axios({
        method: 'get',
        url: 'http://172.91.10.108:8080/getIpAddressesOfNetworkAddress/' + ipAddress

      })
      console.log(response.data)

      rows.value = response.data
    }
  } catch (err) {
    console.error(err)
  }
}

watchEffect(() => {
  getIpAddresses()
  // rows.value = getIpAddresses(ipAddress)
})

</script>

<style scoped>

</style>
