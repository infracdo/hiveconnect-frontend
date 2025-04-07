<template>
  <q-dialog
    v-model="localIsVisible"
    persistent
    class="rounded-lg"
    position="right"
  >
    <q-card
      class="px-6 pb-6 dialog-content"
      style="
        max-width: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
      "
    >
      <q-form
        @submit="handleSubmit"
        style="flex: 1; display: flex; flex-direction: column"
        novalidate
      >
        <div
          style="z-index: 2"
          class="text-lg font-semibold row items-center no-wrap bg-white h-[52px] pt-4 sticky"
        >
          <span> Add New Network </span>
        </div>

        <q-card-section class="mt-4 p-0" style="z-index: 1">
          <div class="mb-4" style="display: flex; gap: 16px">
            <!-- CIDR block input field -->
            <Inputs
              v-model="newNetwork.cidrBlock"
              label="CIDR Block"
              placeholder="Ex: 100.126.0.0/22"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Default gateway input field -->
            <Inputs
              v-model="newNetwork.defaultGateway"
              label="Default Gateway"
              placeholder="Ex: 100.126.0.1"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Broadcast address input field -->
            <Inputs
              v-model="newNetwork.broadcastAddress"
              label="Broadcast Address"
              placeholder="Ex: 100.126.0.255"
              required
              @input="noLeadingWhitespace"
            />
          </div>

          <div class="mb-4" style="display: flex; gap: 16px">
            <!-- Network address input field -->
            <Inputs
              v-model="newNetwork.networkAddress"
              label="Network Address"
              placeholder="Ex: 100.126.0.0"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Network name input field -->
            <Inputs
              v-model="newNetwork.networkName"
              label="Network Name"
              placeholder="Ex: MBY"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Network type radio button/input field -->
            <!-- <RadioButton
              v-model="newNetwork.networkType"
              label="Network Type"
              :options="networkTypeOptions"
              required
            /> -->
            <Selects
              v-model="newNetwork.networkType"
              label="Network Type"
              :options="networkTypeOptions"
              required
            />

            <!-- Account number input field (only shown if 'Enterprise' is selected in radiobutton) -->
            <!-- <Inputs
              v-if="newNetwork.networkType === 'Enterprise'"
              v-model="newNetwork.accountNumber"
              label="Account Number"
              required
              @input="noLeadingWhitespace"
            /> -->
          </div>

          <div class="mb-4" style="display: flex; gap: 16px">
            <!-- Vlan ID input field -->
            <Inputs
              v-model="newNetwork.vlanId"
              label="VLAN ID"
              placeholder="Ex: 2010"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Location input field -->
            <!-- <Inputs
              v-model="newNetwork.location"
              label="Location"
              placeholder="Enter location"
              required
              @input="noLeadingWhitespace"
            /> -->
            <Selects
              v-model="newNetwork.location"
              label="Location"
              :options="locationOptions"
              optionLabel="label"
              optionValue="value"
              required
            />
          </div>

          <!-- Notes input field -->
          <!-- <div class="mb-4" style="display: flex; gap: 16px">
            <Inputs
              v-model="newNetwork.location"
              label="Notes"
              class="w-full"
              @input="noLeadingWhitespace"
            />
          </div> -->
        </q-card-section>

        <!-- Buttons -->
        <div
          class="mt-4"
          style="display: flex; justify-content: flex-end; margin-top: auto"
        >
          <!-- Cancel button -->
          <Buttons
            label="Cancel"
            v-close-popup
            color="bg-transparent"
            textColor="text-primary-600"
            button="modal"
            @click="handleCancel"
          />

          <!-- Add Network submit button -->
          <Buttons
            class="ml-2"
            color="bg-primary-600"
            textColor="text-white"
            label="Add Network"
            type="submit"
            button="modal"
            v-close-popup
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useKeycloak } from "src/composables/useKeycloak";
import Swal from "sweetalert2";
import Buttons from "../inputs/Buttons.vue";
import Inputs from "../inputs/Inputs.vue";
import RadioButton from "../RadioButton.vue";
import Selects from "../inputs/Selects.vue";
import {
  addNewNetwork,
  addFrontendLogger,
} from "src/api/HiveConnectApis/hiveConnect";

const props = defineProps<{
  isVisible: boolean;
}>();

const route = useRoute();
const keycloak = useKeycloak();
const localIsVisible = ref(props.isVisible);
const inputValue = ref("");

const newNetwork = reactive({
  cidrBlock: "",
  defaultGateway: "",
  broadcastAddress: "",
  networkAddress: "",
  networkName: "",
  networkType: "",
  // accountNumber: "",
  vlanId: "",
  location: "",
});

const networkTypeOptions = [
  {
    label: "Private",
    value: "Private",
  },
  // { value: "Enterprise", label: "Enterprise" },
  // { value: "Residential", label: "Residential" },
];

const locationOptions = [
  {
    label: "CDO",
    value: "CDO",
  },
  {
    label: "Davao",
    value: "DAVAO",
  },
  {
    label: "Malaybalay",
    value: "MBY",
  },
];

// Method to remove leading whitespace in inputs during typing
const noLeadingWhitespace = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/^\s+/, "");
  inputValue.value = input.value;
};

const emit = defineEmits<{
  (event: "update:isVisible", value: boolean): void;
}>();

// Method to reset form when cancel button is clicked
const handleCancel = () => {
  newNetwork.cidrBlock = "";
  newNetwork.defaultGateway = "";
  newNetwork.broadcastAddress = "";
  newNetwork.networkAddress = "";
  newNetwork.networkName = "";
  newNetwork.networkType = "";
  // newNetwork.accountNumber = "";
  newNetwork.vlanId = "";
  newNetwork.location = "";

  localIsVisible.value = false;
};

const handleSubmit = () => {
  // Display confirmation alert
  Swal.fire({
    title: "Confirm",
    text: "Are you sure you want to add a new network?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1d6499",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed",
    reverseButtons: true,
    allowOutsideClick: false,
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      // Send a user action log for attempting to add a new network
      const user = keycloak.tokenParsed.given_name;
      const action = "add new network";
      const details = `${user} attempted to add a new network`;
      const page = route.path?.toString() || "Unknown page";
      const userAgent = navigator.userAgent;

      addFrontendLogger(user, action, details, page, userAgent)
        .then(() => console.log("Frontend log sent successfully."))
        .catch((error) => console.error("Error sending frontend log: ", error));

      // Execute addNewNetwork through API call
      try {
        const response = await addNewNetwork(
          newNetwork.cidrBlock,
          newNetwork.defaultGateway,
          newNetwork.broadcastAddress,
          newNetwork.networkAddress,
          newNetwork.networkName,
          newNetwork.networkType,
          newNetwork.vlanId,
          newNetwork.location
        );

        if (response.status === 201) {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonColor: "#1d6499",
          });

          console.log("Success response for adding new network: ", response);
        }
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#fd0808",
        });

        console.error("Error while adding new network: ", error);
        return false;
      }
    },
  });
};

watch(
  () => props.isVisible,
  (newVal) => {
    if (props.isVisible) {
      localIsVisible.value = newVal;
    }
  }
);

watch(localIsVisible, (newVal) => {
  emit("update:isVisible", newVal);
});
</script>

<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
.q-dialog .q-card {
  border-radius: 8px;
}
.dialog-content {
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.dialog-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
</style>
