<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full sm:px-6 lg:px-12">
        <div class="overflow-hidden">
          <!-- Table header -->
          <table
            class="table-fixed min-w-full text-left text-sm last:text-right"
          >
            <thead class="border-b border-neutral-200 font-medium">
              <tr class="text-gray-iron-500">
                <th
                  scope="col"
                  v-for="header in tableColumns.filter((col) =>
                    visibleColumns.includes(col.name)
                  )"
                  :key="header.name"
                  :class="
                    header.name === 'actions'
                      ? 'pr-6 pt-6 pb-2 font-light text-xs uppercase text-primary-gray-500 text-center'
                      : 'pr-6 pt-6 pb-2 font-light text-xs uppercase text-primary-gray-500'
                  "
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
              >
                <td
                  v-for="column in tableColumns.filter((col) =>
                    visibleColumns.includes(col.name)
                  )"
                  :key="column.name"
                  :class="
                    column.name === 'actions'
                      ? 'pr-6 py-2 text-gray-iron-900 font-normal text-center'
                      : 'pr-6 py-2 text-gray-iron-900 font-normal'
                  "
                >
                  <slot
                    :name="column.name"
                    :row="row"
                    :value="row[column.name]"
                  >
                    <span> {{ row[column.name] }} </span>
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination controls -->
          <div class="flex justify-end items-center mt-4">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface TableRow {
  [key: string]: any;
}

interface TableColumn {
  name: string;
  label: string;
}

// Define props structure
interface Props {
  tableColumns: TableColumn[];
  tableRows: TableRow[];
  visibleColumns?: string[];
  rowsPerPage?: number;
  moduleName?: string;
  callback?: (
    event: Event,
    row: TableRow,
    index: number,
    module: string
  ) => void;
}

// Define props
const props = defineProps<Props>();

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

// TODO: recheck this as this only filters the current page (pagination)
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

const handleCallback = (event: Event, row: TableRow, index: number) => {
  if (props.callback) {
    props.callback(event, row, index, props.moduleName || "defaultModule");
  }
};
</script>
