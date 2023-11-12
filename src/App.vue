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

.table-top-right
  display: flex
  flex-direction: column
  gap: 0.5em

@media (min-width: 480px)
  .table-top-right
    flex-direction: row
    gap: 1em

@media (min-width: 1200px)
  .my-sticky-last-column-table
    thead tr:last-child th:last-child

      background-color: white

    td:last-child
      background-color: white

    th:last-child,
    td:last-child
      position: relative
      right: 0
      z-index: 0
</style>
