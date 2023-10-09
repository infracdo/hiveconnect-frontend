<!-- eslint-disable camelcase -->
<template>
  <q-page padding>
    <q-table
      :rows="rows"
      row-key="name"
      :columns="columns"
      :loading="rows.length > 0 ? false: true"
      :pagination="{
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
            @click="onOptions(props.row.id)"
          />
        </q-td>
      </template>
      <template #top>
        <q-btn
          color="primary"
          label="Add New Client"
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
    <add-new-client
      :is-open="modalOpen"
      @close-modal="openModal"
    />
    <subscriber-modal
      :data-id="dataId"
      :get-subsribers="getClients"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar'
import { onMounted, ref, watchEffect } from 'vue'
import { useSubscriberStore } from 'src/stores/subscriber/subscriber-store'
import axios from 'axios'
import SubscriberModal from 'src/components/InetConfig/SubscriberModal.vue'
import { getClients } from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs'
import addNewClient from '../components/InetConfig/AddNewClient.vue'
const store = useSubscriberStore()
const dataId = ref<string>()
const rows = ref([])
const filter = ref('')
const columns: QTableProps['columns'] = store.$state.subscribercolumns
const modalOpen = ref(false)

const openModal = () => {
  modalOpen.value = !modalOpen.value
}

const onOptions = async (id: string) => {
  dataId.value = id
  await axios.get('http://127.0.0.1:8000/api/subscriber_test/' + id)
    .then((response) => {
      // subscriberData.value = response.data
      store.$state.subscriberDetail = response.data
      const {

        subscriber_name,
        serial_number,
        acc_no,
        package_type,
        ssid,
        password,
        mode,
        olt_ip,
        olt_interface

      } = response.data
      store.$patch({
        subscriberDetail: {
          subscriber_name,
          serial_number,
          acc_no,
          package_type,
          mode,
          ssid,
          password,
          olt_ip,
          olt_interface
        }
      })

      if (response) {
        store.$state.modalIsOpen = !store.$state.modalIsOpen
      } else {
        throw new Error('Could not retrieve data!')
      }
    }).catch((error) => {
      console.log(error)
    })
}

watchEffect(async () => {
  rows.value = await getClients()
})

</script>

<style scoped>

</style>
