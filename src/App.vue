<template>
  <router-view />
</template>

<script setup lang="ts"></script>

<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: whitesmoke

  td:last-child
    background-color: whitesmoke

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
