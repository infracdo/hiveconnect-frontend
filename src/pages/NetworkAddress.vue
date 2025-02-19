<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Network Address
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ networkAddressCount }} network
            {{ networkAddressCount < 2 ? "address" : "addresses" }}
          </p>
        </div>

        <!-- Table controls here -->
        <div class="flex flex-row justify-between w-full">
          <!-- Search bar filter -->
          <div class="flex flex-row q-gutter-x-sm">
            <SearchBar
              :modelValue="filter"
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
              :tableRows="filteredRows"
              :rowsPerPage="10"
              :loading="rows.length > 0 ? false : true"
              @rowClick="openEditModal"
            >
              <!-- Actions column provision action button -->
              <template #actions="{ row }">
                <div class="flex gap-2">
                  <q-icon
                    name="edit"
                    size="sm"
                    class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                    @click="openEditModal(row.networkAddress)"
                  />
                </div>
              </template>

              <!-- TABLE NOTES (REMINDER) -->
              <!-- TODO:(1) In current hive, there is an edit button in the actions column -->
              <!-- TODO:(2) In current hive, the network address should be clickable and navigate to the Network Address Detail page-->
            </Table>

            <!-- REVIEW: In current hive, it displays 'add new network modal' -->
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

// RECENTLY ADDED //
import SearchBar from "src/components/SearchBar.vue";
import Table from "src/components/Table.vue";
import NetworkAddress from "../NetworkAddress.vue";

// Store search term/s from SearchBar
const filter = ref("");
const store = useNetworkStore();
// const rows = ref<INetworkAddress[]>([]);
const rows = ref([]);
// RECENTLY UPDATED: returns an empty array if the data is undefined
// Define table column from 'network-address' Pinia store
const columns: QTableProps["columns"] = store.$state.networkColumn || [];
const modalOpen = ref(false);

const openModal = () => {
  modalOpen.value = !modalOpen.value;
};

watchEffect(async () => {
  rows.value = await getNetworkAddresses();
});

// RECENTLY ADDED //

// Count total number of rows (network addresses) in the table to display in the page description
const networkAddressCount = computed(() => rows.value.length);

// Display row/s based on search term
const filteredRows = computed(() => {
  if (!filter.value) return rows.value;

  return rows.value.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(filter.value.toLowerCase())
    )
  );
});

// Method triggered when entering in SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

const openEditModal = async (NetworkAddress: string) => {};
</script>
