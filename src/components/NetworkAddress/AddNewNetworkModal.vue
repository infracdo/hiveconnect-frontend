<template>
  <q-page>
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
              <q-input
                v-model="addNewNetwork.networkAddress"
                outlined
                label="Network Addresss"
              />
              <q-field outlined label="Network Type" stack-label class="">
                <template #control>
                  <div class="q-gutter-md q-mt-xs">
                    <q-radio
                      v-model.trim="addNewNetwork.networkType"
                      dense
                      val="Enterprise"
                      label="Enterprise"
                    />
                    <q-radio
                      v-model.trim="addNewNetwork.networkType"
                      dense
                      val="Residential"
                      label="Residential"
                    />
                  </div>
                </template>
              </q-field>
              <q-input
                v-if="addNewNetwork.networkType === 'Enterprise'"
                v-model="addNewNetwork.accountNumber"
                outlined
                label="Account Number"
              />

              <q-input
                v-model="addNewNetwork.vlanId"
                outlined
                label="VLAN ID"
              />
              <q-input
                v-model="addNewNetwork.networkName"
                outlined
                label="Site"
              />
              <q-input
                v-model="addNewNetwork.location"
                outlined
                label="Notes"
              />
            </div>
          </q-card-section>

          <!-- Buttons -->
          <div
            class="mt-4"
            style="display: flex; justify-content: flex-end; margin-top: auto"
          >
            <Buttons
              label="Cancel"
              v-close-popup
              color="bg-transparent"
              textColor="text-primary-600"
              button="modal"
            />

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
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import Buttons from "../inputs/Buttons.vue";
import Inputs from "../inputs/Inputs.vue";

const props = defineProps<{
  isVisible: boolean;
}>();

const addNewNetwork = reactive({
  networkAddress: "",
  accountNumber: "",
  networkType: "",
  vlanId: "",
  networkName: "",
  location: "",
});

const localIsVisible = ref(props.isVisible);

const emit = defineEmits<{
  (event: "update:isVisible", value: boolean): void;
}>();

const handleSubmit = (event: Event) => {
  console.log("Handle submit for add new network");
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
