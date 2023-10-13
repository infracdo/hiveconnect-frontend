<template>
  <q-page>
    <q-dialog v-model="isOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add New Network</div>
        </q-card-section>

        <q-card-section class="q-pt-none flex-network">
          <q-input
            v-model="addNewNetwork.networkAddress"
            outlined
            label="Network Address"
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

          <q-input v-model="addNewNetwork.vlanId" outlined label="VLAN ID" />
          <q-input v-model="addNewNetwork.site" outlined label="Site" />
          <q-input v-model="addNewNetwork.notes" outlined label="Notes" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" />
          <q-btn flat label="close" color="primary" @click="closeModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { toRefs, reactive } from 'vue';

const props = defineProps({ isOpen: Boolean });
const { isOpen } = toRefs(props);
const emit = defineEmits(['closeModal']);
const closeModal = () => {
  emit('closeModal');
};

const addNewNetwork = reactive({
  networkAddress: '',
  accountNumber: '',
  networkType: '',
  vlanId: '',
  site: '',
  notes: '',
});
</script>

<style scoped>
.flex-network {
  min-width: 350px;
}

@media screen and (min-width: 660px) {
  .flex-network {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
}
</style>
