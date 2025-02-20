<template>
  <q-page padding>
    <q-table
      title="Network Addresss"
      :rows="rows"
      :filter="filter"
      row-key="name"
      :columns="columns"
      :loading="loading"
      :pagination="{
        rowsPerPage: 10,
      }"
      :dense="$q.screen.lt.md"
    >
      <template #body-cell-networkAddress="props">
        <q-td :props="props" clickable>
          <router-link
            class="ip-link"
            :to="`network-address/${props.row.networkAddress}`"
          >
            {{ props.row.networkAddress }}
          </router-link>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" clickable icon="edit" />
      </template>

      <template #top-right>
        <!-- <q-btn color="primary" label="Add New Network" @click="openModal" /> -->
        <!-- <q-space /> -->
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

    <add-new-network-modal :is-open="modalOpen" @close-modal="openModal" />
    <q-page />
  </q-page>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useNetworkStore } from "src/stores/network-address/network-address";
import { QTableProps } from "quasar";
import { ref, onMounted } from "vue";

import { getNetworkAddresses } from "src/api/HiveConnectApis/hiveConnect";
import AddNewNetworkModal from "src/components/NetworkAddress/AddNewNetworkModal.vue";

const filter = ref("");
const store = useNetworkStore();
const rows = ref([]);
const columns: QTableProps["columns"] = store.$state.networkColumn;
const modalOpen = ref(false);
const loading = ref<boolean>(false);

const openModal = () => {
  modalOpen.value = !modalOpen.value;
};
onMounted(async () => {
  loading.value = true;
  try {
    rows.value = await getNetworkAddresses();
  } catch (error) {}
  loading.value = false;
});
</script>

<style scoped>
.body--dark .ip-link {
  color: white;
}
.ip-link {
  cursor: pointer;
  text-decoration: none;
  color: black;
}
.ip-link:hover {
  color: blue;
  text-decoration: underline;
}
</style>
