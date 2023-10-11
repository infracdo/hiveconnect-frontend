<template>
  <q-page padding>
    <iframe
      src="http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?orgId=1&panelId=1&refresh=5s"
      width="700"
      height="350"
      class="grafana"
      frameborder="0"
    ></iframe>
    <iframe
      src="http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-uptime?orgId=1&panelId=2refresh=5s"
      width="700"
      height="300"
      frameborder="0"
    ></iframe>
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped></style>
