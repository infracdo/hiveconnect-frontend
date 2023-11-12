<template>
  <q-page padding>
    <q-table
      class="my-sticky-last-column-table"
      title="Hive Connect Provisioned"
      row-key="name"
      :columns="columns"
      :rows="rowsHive"
      :loading="loading"
      :pagination="{
        rowsPerPage: 10,
      }"
      :dense="$q.screen.lt.md"
      :filter="filter"
      :visible-columns="visibleColumns"
    >
      <template #top-right>
        <div class="table-top-right">
          <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            options-cover
            style="min-width: 150px"
          />
          <q-input
            v-model="filter"
            filled
            dense
            label="Search"
            debounce="300"
            color="primary"
            clearable
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-icon
            name="autorenew"
            class="cursor-pointer q-ma-sm"
            size="sm"
            @click="getProvisioned"
            flat
          />
        </div>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            icon="build"
            @click="
              openTroubleshootModal(
                props.row.onuDeviceName + '-' + props.row.ipAssigned,
                props.row.id
              )
            "
            :disable="
              props.row.onuDeviceName === null || props.row.onuDeviceName === ''
            "
          >
            <q-tooltip
              v-if="
                props.row.onuDeviceName === null ||
                props.row.onuDeviceName === ''
              "
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
            >
              Device Name Missing!
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <troubleshoot-client
      :confirm="openTroubleShootModal"
      :close-modal="closeTroubleShootModal"
      :device-name="deviceName"
      :clientId="clientId"
    ></troubleshoot-client>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getHiveClients } from "src/api/HiveConnectApis/hiveConnect";
import { useSubscriberStore } from "src/stores/subscriber/subscriber-store";
import { IClient } from "src/api/HiveConnectApis/types";
import TroubleshootClient from "src/components/InetConfig/TroubleshootClient.vue";
const store = useSubscriberStore();
const columns = store.$state.subscribercolumns;
const rowsHive = ref<IClient[]>([]);
const deviceName = ref("");
const clientId = ref(0);
const openTroubleShootModal = ref(false);
const filter = ref("");
const visibleColumns = ref([
  "accountNumber",
  "clientName",
  "ipAssigned",
  "onuSerialNumber",
  "onuMacAddress",
  "oltIp",
  "packageTypeId",
  "ssidName",
  "actions",
]);
const loading = ref(false);
const openTroubleshootModal = (onuDeviceName: string, id: number) => {
  deviceName.value = onuDeviceName;
  clientId.value = id;
  openTroubleShootModal.value = !openTroubleShootModal.value;
};

const closeTroubleShootModal = () => {
  openTroubleShootModal.value = !openTroubleShootModal.value;
};

onMounted(async () => {
  await getProvisioned();
});

const getProvisioned = async (): Promise<void> => {
  loading.value = true;
  rowsHive.value = [];
  rowsHive.value = await getHiveClients();
  loading.value = false;
};
</script>

<style scoped lang="sass">
.table-top-right
  display: flex
  flex-direction: column
  gap: 0.5em

@media (min-width: 480px)
  .table-top-right
    flex-direction: row
    gap: 1em
</style>
