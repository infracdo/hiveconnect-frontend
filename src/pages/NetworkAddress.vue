<template>
  <q-page padding>
    <q-table
      title="Network Address"
      :rows="rows"
      row-key="name"
      :columns="columns"
      :loading="rows.length > 0 ? false: true"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useNetworkStore } from '../stores/network-address/network-address'
import { QTableProps } from 'quasar'
import { ref, onMounted } from 'vue'
import axios from 'axios'
const store = useNetworkStore()
const rows = ref([])
const columns: QTableProps['columns'] = store.$state.networkColumn

const getNetworkAddresses = async () => {
  await axios.get('http://127.0.0.1:7547/getNetworkAddresses')

    .then((response) => {
      console.log(response.data)
    }).catch(err => {
      console.log(err)
    })
}

onMounted(() => {
  getNetworkAddresses()
})
</script>

<style scoped>

</style>
