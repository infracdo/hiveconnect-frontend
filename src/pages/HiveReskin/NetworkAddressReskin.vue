<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page header -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Network Address
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ networkAddressCount }} network addresses
          </p>
        </div>

        <!-- Table controls here -->
        <div class="flex flex-row justify-between w-full">
          <!-- Search bar filter -->
          <div class="flex flex-row q-gutter-x-sm">
            <SearchBar
              :searchValue="filter"
              @update:searchValue="filter = $event"
              :searchFunction="handleSearch"
              hint="Search by network address"
            />
          </div>
        </div>

        <!-- Content container here -->
        <div
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg"
        >
          <!-- Table for network addresses -->
          <div class="full-width p-3">
            <Table
              :tableColumns="columns"
              :tableRows="rows"
              :rowsPerPage="10"
              :filter="filter"
              :loading="rows.length > 0 ? false : true"
            >
            </Table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useNetworkStore } from "src/stores/network-address/network-address";
import { QTableProps } from "quasar";
import { ref, watchEffect, computed } from "vue";

import { getNetworkAddresses } from "src/api/HiveConnectApis/hiveConnect";
import AddNewNetworkModal from "src/components/NetworkAddress/AddNewNetworkModal.vue";

// Recently added
import SearchBar from "src/components/SearchBar.vue";
import Table from "src/components/Table.vue";

const filter = ref("");
const store = useNetworkStore();
const rows = ref([]);
// Recently updated: returns an empty array if the data is undefined
// TODO: re-check this part
const columns: QTableProps["columns"] = store.$state.networkColumn || [];
const modalOpen = ref(false);

const openModal = () => {
  modalOpen.value = !modalOpen.value;
};

watchEffect(async () => {
  rows.value = await getNetworkAddresses();
});

// Recently added
const handleSearch = (event: KeyboardEvent) => {
  console.log("Search triggered", event);
};

// Count total number of rows (network addresses) in the table to display in the page description
const networkAddressCount = computed(() => rows.value.length);
</script>
