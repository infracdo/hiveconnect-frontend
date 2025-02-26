<!-- eslint-disable camelcase -->
<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="full-width q-gutter-y-lg">
        <!-- Headings here -->
        <div>
          <!-- Page title -->
          <div class="text-xl font-semibold text-gray-iron-90 mb-2">
            Migration Subscribers
          </div>

          <!-- Page description -->
          <p class="text-sm font-regular text-gray-iron-500">
            There are {{ clientCount }} for migration
            {{ clientCount < 2 ? "subscriber" : "subscribers" }}
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
              hint="Search by ID or account number"
            />
          </div>

          <!-- Refresh icon and dropdown button here -->
          <div class="flex flex-row q-gutter-x-md items-center">
            <!-- Refresh icon -->
            <!-- TODO: when refresh button is clicked, it should trigger a spinner for visibility -->
            <q-icon
              flat
              name="autorenew"
              size="sm"
              class="cursor-pointer"
              @click="refreshTable"
            />

            <!-- Select status (Onhold for Migration/Active for Migration)-->
            <DropdownButton
              @select="handleStatusSelect"
              :columnOptions="statusOptions"
              :selectedOptions="selectedStatus"
              label="Select Status"
            />

            <!-- Dropdown button to select what columns should be displayed in the table -->
            <DropdownButton
              @select="handleColumnSelect"
              :columnOptions="columnOptions"
              :showCheckbox="true"
              :selectedOptions="visibleColumns"
              label="Select Visible Columns"
            />
          </div>
        </div>

        <!-- Content container here -->
        <div
          class="border border-gray-iron-100 q-mt-md row full-width bg-white rounded-lg relative"
        >
          <!-- Table for NEW status clients (to be provision) -->
          <div class="full-width">
            <Table
              :tableColumns="columns"
              :tableRows="filteredRows"
              :visibleColumns="visibleColumns"
              :rowsPerPage="10"
              @rowClick="openModal"
            >
              <!-- Actions column provision action button-->
              <template #actions="{ row }">
                <q-icon
                  name="assignment"
                  size="sm"
                  class="cursor-pointer text-gray-iron-900 font-normal hover:text-primary-1000"
                  @click="openModal(row.id)"
                />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Display modal when a row (client data) is clicked -->
    <Modal
      :isVisible="modalOpen"
      :title="'Migrate Subscriber'"
      :submitButton="'Migrate'"
      @update:isVisible="modalOpen = $event"
      :actionHandler="handleUpdateForMigrationSubscriber"
      showSaveButton
    >
      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Subscriber ID input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="subscriberId"
          label="Subscriber ID"
          readonly
        />

        <!-- Account no input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="subscriberAccountNumber"
          label="Account Number"
          readonly
        />

        <!-- Subscriber name input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="subscriberName"
          label="Subscriber Name"
          readonly
        />
      </div>

      <div class="mb-4" style="display: flex; gap: 16px">
        <!-- Package type input field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="subscriberPackageType"
          label="Package Type"
          readonly
        />

        <!-- Status select field -->
        <Inputs
          :input-style="{ 'text-transform': 'uppercase' }"
          v-model="subscriberStatus"
          label="Subscriber Status"
          readonly
        />
      </div>
    </Modal>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { useMigrationSubscriberStore } from "src/stores/subscriber/migration-subscriber-store";
import {
  getForMigrationSubscribers,
  updateForMigrationSubscribers,
} from "src/api/HiveConnectApis/hiveConnect";
import { IMigrationSubscriber } from "src/api/HiveConnectApis/types";
import SearchBar from "src/components/SearchBar.vue";
import DropdownButton from "src/components/DropdownButton.vue";
import Table from "src/components/Table.vue";
import Modal from "src/components/Modal.vue";
import Inputs from "src/components/inputs/Inputs.vue";
import { searchRows } from "src/util/search";

const store = useMigrationSubscriberStore();
const rows = ref<IMigrationSubscriber[]>([]);
const columns = computed(() => store.$state.migrationSubscriberColumns || []);
const subscriberId = ref(0);
const subscriberAccountNumber = ref("");
const subscriberName = ref("");
const subscriberPackageType = ref("");
const selectedStatus = ref("");
const subscriberStatus = ref("");
const filter = ref("");
const modalOpen = ref(false);
const loading = ref(false);

// When user checks/unchecks an option in the 'Select visible columns' dropdown, it will then save the current state at that point in the local storage
// --- the moment that state is stored in the local storage, it will always display that column/s even if the page reloads or you navigate to another page
// --- unless you change the current state (select/deselect an option)
const savedVisibleColumns = localStorage.getItem("visibleColumns");

// Define shown columns by default
const visibleColumns = ref<string[]>(
  savedVisibleColumns
    ? JSON.parse(savedVisibleColumns)
    : store.$state.migrationSubscriberColumns?.map((col) => col.name) || []
);

// Options for selecting visible columns
const columnOptions = computed(
  () =>
    store.$state.migrationSubscriberColumns?.map((col) => ({
      value: col.name,
      label: col.label || col.name,
    })) || []
);

// Options for select status filter
const statusOptions = ref([
  { label: "All", value: "" },
  { label: "Onhold", value: "ONHOLD" },
  { label: "Active", value: "ACTIVE" },
]);

// Count total number of rows (clients) to display it in the description
const clientCount = computed(() => rows.value.length || 0);

// Filter rows based on search term by using search utility
const filteredRows = computed(() => {
  return searchRows([...rows.value], filter.value);
});

const openModal = async (id: number) => {
  const migrationSubscriber = rows.value.find((row) => row.id === id);
  if (migrationSubscriber) {
    subscriberId.value = migrationSubscriber.id;
    subscriberAccountNumber.value = migrationSubscriber.subscriberAccountNumber;
    subscriberName.value = migrationSubscriber.clientName;
    subscriberPackageType.value = migrationSubscriber.packageType;
    subscriberStatus.value = migrationSubscriber.status;

    modalOpen.value = true;
  }
};

const closeModal = () => {
  modalOpen.value = false;
};

// Method to fetch latest for migration subscribers when clicking the refresh icon
const refreshTable = async () => {
  //getClient from clients_for_activation db, Account table
  rows.value = [];
  filter.value = "";
  loading.value = true;
  try {
    rows.value = await getForMigrationSubscribers();
  } finally {
    loading.value = false;
  }
};

const handleStatusSelect = (status: { label: string; value: string }) => {
  selectedStatus.value = status.value;
};

const handleColumnSelect = (selectedOptions: string[]) => {
  if (
    JSON.stringify(visibleColumns.value) !== JSON.stringify(selectedOptions)
  ) {
    visibleColumns.value = selectedOptions;
    localStorage.setItem("visibleColumns", JSON.stringify(selectedOptions));
  }
};

// Function to update the filter value when the user types in the SearchBar
const handleSearch = (event: KeyboardEvent) => {
  filter.value = (event.target as HTMLInputElement).value;
};

// Method to trigger form save button in modal
const handleUpdateForMigrationSubscriber = async () => {
  // Show confirmation alert
  const confirmResult = await Swal.fire({
    title: "Confirm",
    text: "Are you sure you want to migrate this subscriber?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1d6499",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, migrate it",
    reverseButtons: true,
    allowOutsideClick: false,
  });

  // Display success alert when migrate button is clicked
  if (confirmResult.isConfirmed) {
    try {
      const response = await updateForMigrationSubscribers(
        subscriberAccountNumber.value
      );

      if (response.status == 200) {
        Swal.fire({
          title: "Success",
          text: "Subscriber migrated successfully.",
          icon: "success",
          confirmButtonColor: "#1d6499",
          allowOutsideClick: false,
        }).then(() => {
          refreshTable();
          closeModal();
        });
      } else {
        Swal.fire({
          title: "Failed",
          text: "Failed migrating subscriber.",
          icon: "error",
          confirmButtonColor: "#fd0808",
          allowOutsideClick: false,
        }).then(() => {
          closeModal();
        });
      }
    } catch (error) {
      console.error("API Error: ", error);
      Swal.fire({
        title: "Error",
        text: "An error occured while migrating the subscriber.",
        icon: "error",
        confirmButtonColor: "#fd0808",
        allowOutsideClick: false,
      }).then(() => {
        closeModal();
      });
    }
  }
};

// Retrieve for migration subscribers data as soon as the component/app is mounted
onMounted(async () => {
  console.log("onMounted triggered, retrieve for migration subscribers...");

  try {
    rows.value = await getForMigrationSubscribers();
    console.log("Data for For Migration subscribers fetched successfully.");
  } catch (error) {
    console.error(
      "Error during fetching For Migration subscriber data:",
      error
    );
  }
});
</script>
