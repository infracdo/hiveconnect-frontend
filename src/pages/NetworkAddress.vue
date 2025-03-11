<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headers here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Addresses
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ networkAddressCount }}
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
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg relative"
        >
          <!-- Table for network addresses -->
          <div class="full-width">
            <Table
              :tableColumns="columns"
              :tableRows="filteredRows"
              :rowsPerPage="10"
              :loading="rows.length > 0 ? false : true"
              :callback="getNetworkAddressData"
              @rowClick="openAddNewNetworkModal"
            >
              <!-- Actions column provision action button -->
              <template #actions="{ row }">
                <q-icon
                  name="edit"
                  size="sm"
                  class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                  @click.stop="openAddNewNetworkModal(row.networkAddress)"
                />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Network Modal -->
    <AddNewNetworkModal
      :isVisible="modalAddNewNetwork"
      @update:isVisible="modalAddNewNetwork = $event"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, onMounted } from "vue";
import { event, QTableProps } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useNetworkStore } from "src/stores/network-address/network-address";
import {
  getNetworkAddresses,
  addFrontendLogger,
} from "src/api/HiveConnectApis/hiveConnect";
import { INetworkAddresses } from "src/api/HiveConnectApis/types";
import { searchRows } from "src/util/search";
import { useKeycloak } from "src/composables/useKeycloak";
import AddNewNetworkModal from "src/components/NetworkAddress/AddNewNetworkModal.vue";
import SearchBar from "src/components/SearchBar.vue";
import Table from "src/components/Table.vue";

const store = useNetworkStore();
const router = useRouter();
const route = useRoute();
const keycloak = useKeycloak();
const rows = ref<INetworkAddresses[]>([]);
const columns: QTableProps["columns"] = store.$state.networkColumn || [];
const filter = ref("");
const modalAddNewNetwork = ref(false);
const modalOpen = ref(false);
const loading = ref<boolean>(false);

// Count total number of rows (network addresses) in the table to display in the page description
const networkAddressCount = computed(() => rows.value.length);

// Display row/s based on search term
const filteredRows = computed(() => {
  return searchRows([...rows.value], filter.value);
});

const openModal = () => {
  modalOpen.value = !modalOpen.value;
};

const openAddNewNetworkModal = async (networkAddress: string) => {
  modalAddNewNetwork.value = true;
};

// Method triggered when entering in SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

// Navigate to the Network Address details page
const getNetworkAddressData = (
  event: Event,
  row: any,
  index: number,
  module: string
) => {
  console.log("Row clicked and navigated to address details page.");

  router.push({
    name: "network-address-details",
    params: { ipAddress: row.networkAddress },
    state: { networkAddressData: { ...row } },
  });
};

// Asynchronous function to retrieve network addresses from API
async function fetchNetworkAddresses() {
  try {
    rows.value = await getNetworkAddresses();
    console.log("Network addresses data fetched successfully");
  } catch (error) {
    console.error("Error fetching network addresses: ", error);
  }
}

// Retrieve migration subscribers data as soon as the component is mounted
onMounted(async () => {
  await fetchNetworkAddresses();

  const user = keycloak.tokenParsed.given_name;
  const action = "page visit";
  const details = `${user} visited the ${route.path} page`;
  const page = route.path?.toString() || "Unknown Page";
  const userAgent = navigator.userAgent;

  addFrontendLogger(user, action, details, page, userAgent)
    .then(() => console.log("Frontend log sent successfully."))
    .catch((error) => console.error("Error sending frontend log: ", error));
});
</script>
