<template>
  <div class="flex flex-col relative">
    <!-- q-inner-loading component -->
    <q-inner-loading :showing="props.loading" color="primary-600" />

    <!-- Semi-transparent overlay when loading -->
    <div
      v-if="props.loading"
      class="absolute inset-0 bg-white opacity-50 z-10"
    ></div>
    <div class="relative overflow-x-auto w-full">
      <div class="inline-block min-w-full">
        <div class="overflow-visible">
          <!-- Table -->
          <table class="min-w-full text-left text-sm">
            <!-- Table header -->
            <thead class="border-b border-neutral-200 font-medium">
              <tr class="text-gray-iron-500">
                <th
                  v-for="header in tableColumns.filter((col) =>
                    visibleColumns.includes(col.name)
                  )"
                  :key="header.name"
                  :class="[
                    'whitespace-nowrap px-3 pt-6 pb-2 font-light text-xs uppercase text-primary-gray-500',
                    header.name === 'actions'
                      ? 'sticky right-0 bg-white z-10 text-center'
                      : '',
                    header.name === 'location' ||
                    header.name === 'active' ||
                    header.name === 'onhold'
                      ? 'text-center'
                      : '',
                  ]"
                >
                  {{ header.label }}
                </th>
              </tr>
            </thead>

            <!-- Table body -->

            <tbody>
              <tr
                v-for="(row, index) in paginatedRows"
                :key="row.id"
                @click="handleCallback($event, row, index)"
                class="border-b border-neutral-200 hover:bg-gray-iron-200 transition:transform duration-150 text-gray-iron-900 hover:cursor-pointer"
                :class="{
                  'font-bold bg-primary-gray-50': totalRowStyle && row.isTotal,
                }"
              >
                <td
                  v-for="column in tableColumns.filter((col) =>
                    visibleColumns.includes(col.name)
                  )"
                  :key="column.name"
                  :class="[
                    'px-3 py-2 text-gray-iron-900 font-normal',
                    column.name === 'actions'
                      ? 'sticky right-0 z-10 text-center'
                      : '',
                    column.name === 'monitoringStatus' ? 'text-center' : '',
                    column.name === 'location' ||
                    column.name === 'active' ||
                    column.name === 'onhold'
                      ? 'text-center'
                      : '',
                    totalRowStyle && row.isTotal
                      ? 'font-bold bg-primary-gray-50'
                      : '',
                  ]"
                >
                  <slot
                    :name="column.name"
                    :row="row"
                    :value="row[column.name]"
                  >
                    <template
                      v-if="
                        column.name === 'monitoringStatus' &&
                        row.monitoringStatus
                      "
                    >
                      <!-- <span
                        :class="[
                          'flex items-center justify-center text-sm font-semibold bg-gray-iron-50 px-2 py-1 rounded-lg capitalize',
                          row.monitoringStatus === 'monitored'
                            ? 'text-success-500'
                            : 'text-error-500',
                        ]"
                      >
                        <StatusBadge
                          :status="
                            row.monitoringStatus === 'monitored' ? true : false
                          "
                          class="inline pr-1"
                        />
                        {{ row.monitoringStatus }}
                      </span> -->

                      <q-badge
                        :color="
                          row.monitoringStatus === 'monitored'
                            ? 'positive'
                            : row.monitoringStatus === 'setting up'
                            ? 'warning'
                            : 'negative'
                        "
                        :label="row.monitoringStatus"
                        class="text-caption capitalize"
                      />
                    </template>
                    <span v-else>{{ row[column.name] }}</span>
                  </slot>

                  <!-- <slot
                    :name="column.name"
                    :row="row"
                    :value="row[column.name]"
                  >
                    <span> {{ row[column.name] }} </span>
                  </slot> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div v-if="pagination" class="flex justify-end items-center">
      <q-btn
        @click="prevPage"
        flat
        no-caps
        :disable="currentPage === 1"
        class="px-4 py-2 rounded text-primary-600"
      >
        <q-icon name="chevron_left" size="xs" />
        <p class="font-semibold">Prev</p>
      </q-btn>

      <span class="mx-2 text-gray-iron-500">
        {{ itemsDisplayed }} of {{ tableRows.length }}
      </span>

      <q-btn
        @click="nextPage"
        flat
        no-caps
        :disable="currentPage === totalPages"
        class="px-4 py-2 rounded text-primary-600"
      >
        <p class="font-semibold">Next</p>
        <q-icon name="chevron_right" size="xs" />
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import StatusBadge from "./StatusBadge.vue";

interface TableRow {
  [key: string]: any;
}

interface TableColumn {
  name: string;
  label: string;
}

const props = defineProps<{
  tableColumns: TableColumn[];
  tableRows: TableRow[];
  visibleColumns?: string[];
  rowsPerPage?: number;
  moduleName?: string;
  pagination?: boolean;
  loading?: boolean;
  totalRowStyle?: true;
  callback?: (
    event: Event,
    row: TableRow,
    index: number,
    module: string
  ) => void;
}>();

// Display table columns based on passed visibleColumns prop
const visibleColumns = computed(
  () => props.visibleColumns ?? props.tableColumns.map((col) => col.name)
);

// Initialize currentPage which is 1st page by default
const currentPage = ref(1);

// Compute total pages based on rows length and number of rows per page
const totalPages = computed(() =>
  Math.ceil(props.tableRows.length / (props.rowsPerPage ?? 10))
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * (props.rowsPerPage ?? 10);
  const end = start + (props.rowsPerPage ?? 10);
  return props.tableRows.slice(start, end);
});

const itemsDisplayed = computed(() => {
  const start = (currentPage.value - 1) * (props.rowsPerPage ?? 10) + 1;
  const end = Math.min(
    currentPage.value * (props.rowsPerPage ?? 10),
    props.tableRows.length
  );
  return `${start}-${end}`;
});

// Go to next table page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Go back to previous table page
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Method when a table row is clicked
const handleCallback = (event: Event, row: TableRow, index: number) => {
  if (props.callback) {
    props.callback(event, row, index, props.moduleName || "defaultModule");
  }
};

// Watch for table data changes, especially when filtering is applied
watch(
  () => props.tableRows,
  () => {
    currentPage.value = 1;
  }
);
</script>

<style scoped>
.relative {
  position: relative;
}

.sticky {
  position: sticky;
  right: 0;
}

.sticky::after {
  content: "";
  position: absolute;
  top: 0;
  left: -4px;
  bottom: 0;
  width: 4px;
  box-shadow: inset 4px 0 8px -3px rgba(0, 0, 0, 0.1);
}

th.sticky {
  z-index: 20;
}

td.sticky {
  z-index: 10;
}

.q-table__container {
  overflow: visible !important;
}
</style>
