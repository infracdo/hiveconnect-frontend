<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <div>
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Provisioned Subscribers Report
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            Displays total number of provisioned subscribers (ACTIVE / ONHOLD)
            per location.
          </p>
        </div>

        <!-- Content -->
        <div
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg"
        >
          <!-- Total Count of Active/Onhold Subscribers per Location Table -->
          <div class="full-width">
            <Table :tableColumns="columns" :tableRows="rowsWithTotals"> </Table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getStatusCount } from "src/api/HiveConnectApis/hiveConnect";
import Table from "src/components/Table.vue";

const rows = ref<Array<{ location: string; active: number; onhold: number }>>(
  []
);
const columns = [
  { name: "location", label: "Locations", field: "location" },
  { name: "active", label: "Active", field: "active" },
  { name: "onhold", label: "Onhold", field: "onhold" },
];

const rowsWithTotals = computed(() => {
  // Return an empty array if the there are no rows
  if (rows.value.length === 0) return [];

  // Calculate the total of ACTIVE and ONHOLD subscribers
  const totals = {
    location: "TOTAL",
    active: rows.value.reduce((sum, row) => sum + row.active, 0),
    onhold: rows.value.reduce((sum, row) => sum + row.onhold, 0),
  };

  return [...rows.value, totals];
});

onMounted(async () => {
  try {
    console.log(
      "Fetching total number of active/onhold subscribers per location..."
    );

    const locations = ["CDO", "DAVAO", "MALAYBALAY"];

    const results = await Promise.all(
      locations.map(async (location) => {
        const activeCount = await getStatusCount("ACTIVE", location);
        const onholdCount = await getStatusCount("ONHOLD", location);

        return {
          location,
          active: activeCount || 0,
          onhold: onholdCount || 0,
        };
      })
    );

    rows.value = results;
    console.log(
      "Rows for Provisioned Subscribers Report page table: ",
      rows.value
    );
  } catch (error) {
    console.error(
      "Error while fetching total count for active/onhold subscribers per location: ",
      error
    );
    throw error;
  }
});
</script>
