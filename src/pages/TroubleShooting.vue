<template>
  <q-page padding>
    <div class="grafana">
      <iframe
        src="http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?orgId=1&panelId=1&refresh=5s"
        width="700"
        height="350"
        frameborder="0"
      ></iframe>
      <iframe
        src="http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?orgId=1&panelId=2refresh=5s"
        width="700"
        height="300"
        frameborder="0"
      ></iframe>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped>
.grafana {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
