<template>
  <q-page padding>
    <q-table
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
        >
          <router-link
            class="ip-link"
            :to="`network-address/${props.row.networkAddress}`"
          >
            {{ props.row.networkAddress }}
          </router-link>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td
          :props="props"
          clickable
          icon="edit"
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

    <add-new-network-modal
      :is-open="modalOpen"
      @close-modal="openModal"
    />
    <q-page />
  </q-page>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useNetworkStore } from '../stores/network-address/network-address'
import { QTableProps } from 'quasar'
import { ref, watchEffect } from 'vue'
import axios from 'axios'

import AddNewNetworkModal from 'src/components/NetworkAddress/AddNewNetworkModal.vue'
// state
const filter = ref('')
const store = useNetworkStore()
const rows = ref([])

const columns: QTableProps['columns'] = store.$state.networkColumn

const modalOpen = ref(false)
// methods

const getNetworkAddresses = async () => {
  await axios.get('http://172.91.10.108:8080/getNetworkAddresses')

    .then((response) => {
      rows.value = response.data
    }).catch(err => {
      console.log(err)
    })
}
const openModal = () => {
  modalOpen.value = !modalOpen.value
}

watchEffect(() => {
  getNetworkAddresses()
})
</script>

<style scoped>
.ip-link{
  cursor: pointer;
  text-decoration: none;
  color: black;

}
.ip-link:hover {
  color: blue;
  text-decoration: underline;
}
</style>
