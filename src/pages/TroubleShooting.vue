<template>
  <q-page padding>
    <div class="select">
      <q-select
        v-model="selectSubscriber"
        :options="deviceNames"
        label="Select Subscriber"
        filled
      />
      <q-btn
        icon="autorenew"
        class="cursor-pointer q-mx-sm"
        @click="ayy"
        flat
      />
    </div>
    <div class="grafana">
      <iframe
        :src="`http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?from=now-15m&to=now&orgId=1&panelId=1&refresh=5s&var-Subscriber=${selectSubscriber}`"
        class="grafana-panel"
        frameborder="0"
      ></iframe>
      <iframe
        :src="`http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?from=now-15m&to=now&orgId=1&panelId=2&refresh=5s&var-Subscriber=${selectSubscriber}`"
        class="grafana-panel"
        frameborder="0"
      ></iframe>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getClients } from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs';
const selectSubscriber = ref('');

const deviceNames = ref([]);

const ayy = async () => {
  const clients = await getClients();
  deviceNames.value = clients.map(
    (client: { onuDeviceName: string }) => client.onuDeviceName
  );
};
</script>

<style scoped>
.grafana {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.select {
  max-width: 200px;
  display: flex;
  margin-bottom: 15px;
}
.grafana-panel {
  aspect-ratio: 16 / 7;
  max-width: 750px;
}
@media screen and (min-width: 660px) {
}
</style>
