<template>
  <q-page padding>
    <div class="select">
      <q-select
        v-model="selectSubscriber"
        :options="deviceNames"
        label="Select Subscriber"
        filled
        class="select-subscriber"
      />
      <q-btn
        icon="autorenew"
        class="cursor-pointer q-mx-sm"
        @click="ayy"
        flat
      />
    </div>
    <div class="grafana">
      <div v-for="idx in grafanaFor" class="grafana-center">
        <iframe
          loading="lazy"
          :src="`http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?from=now-15m&to=now&orgId=1&panelId=${idx}&refresh=5s&var-Subscriber=${selectSubscriber}`"
          class="grafana-panel"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getClients } from 'src/api/NetworkAddressAPI.ts/networkAddressAPIs';
const selectSubscriber = ref('');
const optionsni = ['mitzi_marie_bw1', 'Mitzi_Mae_bw1'];
const deviceNames = ref([]);

const grafanaFor = [10, 2, 8, 3, 6, 5, 4];

const ayy = async () => {
  const clients = await getClients();
  deviceNames.value = clients.map(
    (client: { onuDeviceName: string }) => client.onuDeviceName
  );
};
</script>

<style scoped>
.grafana {
  display: grid;
  margin: 0 auto;
  /* flex-direction: row; */
  /* grid-template-columns: 1fr; */
  /* display: flex;
  justify-content: center; */
  max-width: 1500px;
  gap: 0.5em;
}

.grafana-panel {
  width: 100%;
  aspect-ratio: 16 / 6;
  /* max-width: 750px; */
}
.select {
  display: flex;
  max-width: 1500px;
  margin: 0 auto 15px auto;
}
.select-subscriber {
  min-width: 200px;
}
.sample {
  width: 200px;
  height: 200px;
  background-color: red;
  border: 1px solid black;
}
@media screen and (min-width: 660px) {
  .grafana {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5em;
  }
}
</style>
