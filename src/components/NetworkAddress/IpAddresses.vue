<template>
  <q-page>
    <div class="row q-pa-lg">
      <div
        class="flex flex-row full-width q-mb-md items-center justify-between"
      >
        <div class="flex flex-row items-center">
          <Buttons
            icon="eva-arrow-back-outline"
            label="Back"
            color="bg-gray-iron-100"
            class="mr-4"
            textColor="text-gray-iron-900 font-normal"
            @click="goBack"
            small
            normal
          />

          <p class="text-sm text-semibold leading-5">
            <span class="text-primary-600">Addresses / </span>
            <span>{{
              networkAddressData.networkAddress
                ? networkAddressData.networkAddress
                : "N/A"
            }}</span>
          </p>
        </div>
      </div>

      <div class="flex flex-row w-full">
        <div class="flex flex-col">
          <div class="flex flex-row mb-6">
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">NETWORK ADDRESS</p>
              <p class="text-xl font-medium text-gray-iron-900">
                {{
                  networkAddressData.networkAddress
                    ? networkAddressData.networkAddress
                    : "N/A"
                }}
              </p>
            </div>

            <q-separator vertical inset size="2px" class="mx-4" />

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">CIDR BLOCK</p>
              <p class="text-xl font-normal text-gray-iron-900">
                {{
                  networkAddressData.cidrBlock
                    ? networkAddressData.cidrBlock
                    : "N/A"
                }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">DEFAULT GATEWAY</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  networkAddressData.defaultGateway
                    ? networkAddressData.defaultGateway
                    : "N/A"
                }}
              </p>
            </div>

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">NOTES</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  networkAddressData.location
                    ? networkAddressData.location
                    : "-"
                }}
              </p>
            </div>

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">SITE</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  networkAddressData.networkName
                    ? networkAddressData.networkName
                    : "N/A"
                }}
              </p>
            </div>

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">TYPE</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  networkAddressData.networkType
                    ? networkAddressData.networkType
                    : "N/A"
                }}
              </p>
            </div>

            <div class="flex flex-col">
              <p class="text-xs text-gray-iron-500">VLAN ID</p>
              <p class="text-sm text-gray-iron-900 leading-5">
                {{
                  networkAddressData.vlanId ? networkAddressData.vlanId : "N/A"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="flex flex-row justify-between items-center mb-2">
          <p class="text-xl font-medium text-gray-iron-900">
            Network Addresses
          </p>

          <!-- Search filter -->
          <SearchBar
            :modelValue="filter"
            @update:searchValue="filter = $event"
            :searchFunction="handleSearch"
            hint="Search by IP address or account number"
          />
        </div>

        <!-- Table na dayon dani -->
        <div
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg relative"
        >
          <div class="full-width">
            <Table
              :tableColumns="columns"
              :tableRows="filteredRows"
              pagination
              :rowsPerPage="10"
              :loading="isLoading"
            >
              <!-- PENDING FEATURE: previous hive did not specify what is this for or what the modal should contain -->
              <template #actions="{ row }">
                <q-icon
                  name="edit"
                  size="sm"
                  class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useIpAddressStore } from "../../stores/network-address/ip-address";
import { ref, watchEffect, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getIpAddresses,
  addFrontendLogger,
} from "src/api/HiveConnectApis/hiveConnect";
import { IipAddressesOfCidrBlock } from "src/api/HiveConnectApis/types";
import { searchRows } from "src/util/search";
import { useKeycloak } from "src/composables/useKeycloak";
import Buttons from "../inputs/Buttons.vue";
import Table from "../Table.vue";
import SearchBar from "../SearchBar.vue";

const route = useRoute();
const keycloak = useKeycloak();
const storeIp = useIpAddressStore();
const router = useRouter();
const columns = storeIp.$state.ipAddressColumn?.length
  ? storeIp.$state.ipAddressColumn
  : [];
const ipAddress = route.params.ipAddress;
const rows = ref<IipAddressesOfCidrBlock[]>([]);
const filter = ref("");
const isLoading = ref(false);

watchEffect(async () => {
  try {
    isLoading.value = true;
    rows.value = await getIpAddresses(ipAddress);
  } catch (error) {
    console.error("Error while fetching IP addresses: ", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
});

const networkAddressData = ref(
  (router.options.history.state as { networkAddressData?: any })
    ?.networkAddressData || {}
);

const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

const filteredRows = computed(() => {
  return searchRows([...rows.value], filter.value);
});

const goBack = () => {
  router.push({ name: "network-address" });
};

onMounted(() => {
  const user = keycloak.tokenParsed.given_name;
  const action = "page visit";
  const details = `${user} visited the ${route.path} page`;
  const page = route.path?.toString() || "Unknown Page";
  const userAgent = navigator.userAgent;

  addFrontendLogger(user, action, details, page, userAgent)
    .then(() => console.log("Frontend log sent successfull."))
    .catch((error) => console.error("Error sending frontend log: ", error));
});
</script>
