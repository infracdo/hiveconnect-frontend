<!-- eslint-disable camelcase -->
<template>
  <q-page padding>
    <q-table
      title="Subscriber Table"
      :rows="rows"
      row-key="name"
      :columns="columns"
      :loading="rows.length > 0 ? false: true"
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
    </q-table>
    <subscriber-modal
      :data-id="dataId"
      :get-subsribers="getSubsribers"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar'
import { onMounted, ref } from 'vue'
import { useSubscriberStore } from 'src/stores/subscriber/subscriber-store'
import axios from 'axios'
import SubscriberModal from 'src/components/InetConfig/SubscriberModal.vue'

const store = useSubscriberStore()
const dataId = ref<string>()
const rows = ref([])

const columns: QTableProps['columns'] = store.$state.subscribercolumns

const getSubsribers = async () => {
  await axios
    .get('http://127.0.0.1:8000/api/subscriber_test')
    .then((response) => {
      if (response) {
        rows.value = response.data
      } else {
        throw new Error('Could not retrieve data!')
      }
    })
    .catch((error) => {
      console.log(error)
    })
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

onMounted(() => {
  getSubsribers()
})

</script>

<style scoped>

</style>
