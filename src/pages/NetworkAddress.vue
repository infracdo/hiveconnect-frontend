<template>
  <q-page padding>
    <q-table
      v-show="showNetworkAddressTable"
      title="Network Address"
      :rows="rows"
      :filter="filter"
      row-key="name"
      :columns="columns"
      :loading="rows.length > 0 ? false: true"
      :pagination="{

        rowsPerPage: 10
      }"
    >
      <template #body-cell-networkAddress="props">
        <q-td
          :props="props"
          clickable
          class="ip-link"
          @click="currentNetwork(props.row.networkAddress)"
        >
          {{ props.row.networkAddress }}
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td
          :props="props"
          clickable
          icon="edit"
          @click="currentNetwork(props.row.networkAddress)"
        />
      </template>

      <template #top>
        <q-btn
          color="primary"
          label="Add New Network"
          @click="openModal"
        />
        <q-space />
        <q-input
          v-model="filter"
          filled
          dense
          label="Search"
          debounce="300"
          color="primary"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <ip-addresses
      v-show="!showNetworkAddressTable"
      :network-address="networkAddress"
      :network-address-table="networkAddressTable"
    />
    <add-new-network-modal
      :is-open="modalOpen"
      @close-modal="openModal"
    />
    <q-page />
  </q-page>
</template>

<script setup lang="ts">
import { useNetworkStore } from '../stores/network-address/network-address'
import { QTableProps } from 'quasar'
import { ref, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import IpAddresses from 'src/components/NetworkAddress/IpAddresses.vue'
import AddNewNetworkModal from 'src/components/NetworkAddress/AddNewNetworkModal.vue'
// state
const filter = ref('')
const store = useNetworkStore()
const rows = ref([])
const showNetworkAddressTable = ref(true)
const columns: QTableProps['columns'] = store.$state.networkColumn
const networkAddress = ref('')
const modalOpen = ref(false)
// methods

const getNetworkAddresses = async () => {
  await axios.get('http://localhost:8080/getNetworkAddresses')

    .then((response) => {
      rows.value = response.data
    }).catch(err => {
      console.log(err)
    })
}
const openModal = () => {
  modalOpen.value = !modalOpen.value
}

const currentNetwork = (address: string) => {
  networkAddress.value = address
  networkAddressTable()
}
const networkAddressTable = () => {
  showNetworkAddressTable.value = !showNetworkAddressTable.value
}

watchEffect(() => {
  getNetworkAddresses()
})
</script>

<style scoped>
.ip-link{
  cursor: pointer;

}
.ip-link:hover {
  color: blue;
  text-decoration: underline;
}
</style>
