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
            <!-- Network address input field -->
            <Inputs
              v-model="newNetwork.networkAddress"
              label="Network Address"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Network type radiobutton field -->
            <RadioButton
              v-model="newNetwork.networkType"
              label="Network Type"
              :options="networkTypeOptions"
              required
            />

            <!-- Account number input field (only shown if 'Enterprise' is selected in radiobutton) -->
            <Inputs
              v-if="newNetwork.networkType === 'Enterprise'"
              v-model="newNetwork.accountNumber"
              label="Account Number"
              required
              @input="noLeadingWhitespace"
            />
          </div>

          <div class="mb-4" style="display: flex; gap: 16px">
            <!-- Vlan ID input field -->
            <Inputs
              v-model="newNetwork.vlanId"
              label="VLAN ID"
              required
              @input="noLeadingWhitespace"
            />

            <!-- Site input field -->
            <Inputs
              v-model="newNetwork.networkName"
              label="Site"
              required
              @input="noLeadingWhitespace"
            />
          </div>

          <div class="mb-4" style="display: flex; gap: 16px">
            <!-- Notes input field -->
            <Inputs
              v-model="newNetwork.location"
              label="Notes"
              class="w-full"
              @input="noLeadingWhitespace"
            />
          </div>
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
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import Buttons from "../inputs/Buttons.vue";
import Inputs from "../inputs/Inputs.vue";
import RadioButton from "../RadioButton.vue";
import { addNewNetwork } from "src/api/HiveConnectApis/hiveConnect";

const props = defineProps<{
  isVisible: boolean;
}>();

const newNetwork = reactive({
  networkAddress: "",
  accountNumber: "",
  networkType: "",
  vlanId: "",
  networkName: "",
  location: "",
});

const networkTypeOptions = [
  { value: "Enterprise", label: "Enterprise" },
  { value: "Residential", label: "Residential" },
];

const localIsVisible = ref(props.isVisible);

// Define inputValue
const inputValue = ref("");
// Method to remove leading whitespace in inputs during typing
const noLeadingWhitespace = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/^\s+/, "");
  inputValue.value = input.value;
};

const emit = defineEmits<{
  (event: "update:isVisible", value: boolean): void;
}>();

const handleSubmit = (event: Event) => {
  console.log("Handle submit for add new network");
};

// Method to reset form when cancel button is clicked
const handleCancel = () => {
  newNetwork.networkAddress = "";
  newNetwork.networkType = "";
  newNetwork.accountNumber = "";
  newNetwork.vlanId = "";
  newNetwork.networkName = "";
  newNetwork.location = "";

  localIsVisible.value = false;
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
