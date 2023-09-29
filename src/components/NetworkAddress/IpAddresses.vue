<template>
  <q-page class="q-pt-md">
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
          @click="props.networkAddressTable()"
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
import axios from 'axios'
import { ref, watchEffect, defineProps, toRefs } from 'vue'
import { IrowIpAddress } from '../models'
const store = useIpAddressStore()
const props = defineProps(['networkAddress', 'networkAddressTable'])
// const { networkAddress } = toRefs(props)
const columns = store.$state.ipAddressColumn
const rows = ref<IrowIpAddress[]>()
const filter = ref('')
const getIpAddresses = async () => {
  try {
    if (props.networkAddress) {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8080/getIpAddressesOfNetworkAddress/' + props.networkAddress

      })
      rows.value = response.data
    }
  } catch (err) {
    console.error(err)
  }
}

watchEffect(() => {
  getIpAddresses()
})
</script>

<style scoped>

</style>
