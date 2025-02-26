<template>
  <q-dialog v-model="localIsVisible" persistent class="rounded-lg">
    <q-card
      class="px-6 pb-6 dialog-content"
      :style="
        props.responseStatus.autoConfig
          ? {
              width: '650px',
              maxWidth: '100%',
              height: '350px',
              maxHeight: '100',
              display: 'flex',
              flexDirection: 'column',
            }
          : {
              width: '650px',
              maxWidth: '100%',
              height: '300px',
              maxHeight: '100',
              display: 'flex',
              flexDirection: 'column',
            }
      "
    >
      <div style="flex: 1; display: flex; flex-direction: column">
        <div
          style="z-index: 2"
          class="text-lg font-semibold row items-center justify-center no-wrap bg-white h-[52px] pt-4 sticky"
        >
          <span> Responses </span>
        </div>

        <q-card-section class="mt-4 p-0" style="z-index: 1">
          <!-- Display ongoing responses -->
          <div
            class="mb-5"
            style="display: flex; flex-direction: column; gap: 10px"
          >
            <!-- Preprovision Checking -->
            <div class="text-gray-iron-900">
              <div class="flex flex-row items-center">
                <div class="mr-2">
                  <q-spinner-tail
                    v-if="
                      props.responses.provisionCheck ===
                      'Preprovision checking ...'
                    "
                    color="primary"
                    size="1.5em"
                  />
                </div>
                <div>
                  Preprovision Checking:
                  <span
                    :class="
                      props.responseStatus.provisionCheck
                        ? 'text-success-500'
                        : 'text-error-500'
                    "
                  >
                    {{ props.responses.provisionCheck }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Auto Config Checking -->
            <div
              v-if="props.responseStatus.provisionCheck"
              class="text-gray-iron-900"
            >
              <div class="flex flex-row items-center">
                <div class="mr-2">
                  <q-spinner-tail
                    v-if="
                      props.responses.autoConfig === 'Executing Auto Config...'
                    "
                    color="primary"
                    size="1.5em"
                  />
                </div>
                <div>
                  Auto Config:
                  <span
                    :class="
                      props.responseStatus.autoConfig
                        ? 'text-success-500'
                        : 'text-error-500'
                    "
                  >
                    {{ props.responses.autoConfig }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Display SSID and password if all checkings passed -->
          <div v-if="props.showProvisionResult" class="text-center">
            <q-separator class="q-mb-lg" />
            <p
              class="uppercase font-semibold q-mb-lg"
              :class="
                props.responseStatus.provisionCheck &&
                props.responseStatus.autoConfig
                  ? 'text-success-700'
                  : 'text-error-700'
              "
            >
              {{
                props.responseStatus.provisionCheck &&
                props.responseStatus.autoConfig
                  ? " Successful Provision!"
                  : "Unsuccessful Provision!"
              }}
            </p>

            <div
              v-if="props.responseStatus.autoConfig"
              style="display: flex; justify-content: space-evenly"
            >
              <div class="flex flex-col gap-1">
                <p class="font-semibold text-gray-iron-900">SSID</p>
                <p class="text-gray-iron-900">{{ props.ssid.name }}</p>
              </div>

              <div class="flex flex-col gap-1">
                <p class="font-semibold">Password</p>
                <p class="text-gray-iron-900">{{ props.ssid.pw }}</p>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- OK button to close modal -->
        <div
          v-if="
            props.responseStatus.autoConfig ||
            (props.responses.provisionCheck !== 'Preprovision checking ...' &&
              props.responses.autoConfig !== 'Executing Auto Config...')
          "
          class="mt-4"
          style="display: flex; justify-content: center; margin-top: auto"
        >
          <Buttons
            label="OK"
            v-close-popup="2"
            color="bg-primary-600"
            textColor="text-white"
            button="modal"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import Buttons from "../inputs/Buttons.vue";

const props = defineProps<{
  isVisible: boolean;
  responses: {
    autoConfig: string;
    monitoring: string;
    provisionCheck: string;
  };
  responseStatus: {
    autoConfig: boolean;
    monitoring: boolean;
    provisionCheck: boolean;
  };
  showProvisionResult: boolean;
  ssid: {
    name: string;
    pw: string;
  };
}>();

const localIsVisible = ref(props.isVisible);
console.log("SSID in ProvisionClient.vue: ", props.ssid.name);
console.log("Password in ProvisionClient.vue: ", props.ssid.pw);

const emit = defineEmits<{
  (event: "update:isVisible", value: boolean): void;
}>();

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

// const ssid = reactive({
//   name: "",
//   pw: "",
// });

// const showProvisionResult = ref(false);
// const showSkeletonDancing = ref(false);

// const responses = reactive({
//   autoConfig: "",
//   monitoring: "",
//   provisionCheck: "",
// });

// const responseStatus = reactive({
//   autoConfig: false,
//   monitoring: false,
//   provisionCheck: false,
// });

// const result = ref("");

// METHODS
</script>
