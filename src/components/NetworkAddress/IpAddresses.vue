<template>
  <q-page class="q-pt-md" padding>
    <q-table
      :filter="filter"
      :columns="columns"
      :rows="rows"
      class="text-center"
      :loading="rows && rows.length > 0 ? false : true"
      :pagination="{
        sortBy: 'ipAddress',
        rowsPerPage: 10,
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
        <q-btn color="primary" label="Back" to="/network-address" />
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
import { useIpAddressStore } from '../../stores/network-address/ip-address';
import { ref, watchEffect } from 'vue';
import { IrowIpAddress } from '../models';
import { useRoute } from 'vue-router';
import { getIpAddresses } from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs';

const route = useRoute();
const storeIp = useIpAddressStore();

const columns = storeIp.$state.ipAddressColumn;
const ipAddress = route.params.ipAddress;
const rows = ref<IrowIpAddress[]>([]);
const filter = ref('');

watchEffect(async () => {
  rows.value = await getIpAddresses(ipAddress);
});
</script>

<style scoped></style>
src/api/NetworkAddressAPI/networkAddressAPIs
src/api/NetworkAddressAPI/networkAddressAPIs
