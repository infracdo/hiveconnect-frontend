<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { watch } from "vue";

const $q = useQuasar();

watch(
  () => $q.dark.isActive,
  (val) => {
    console.log(val ? "On dark mode" : "On light mode");
  }
);
</script>

<style lang="sass">
.body--dark
  .my-sticky-last-column-table
    thead tr:last-child th:last-child
      /* bg color is important for th; just specify one */
      background-color: #1D1D1D
    td:last-child
      background-color: #1D1D1D
    th:last-child,
    td:last-child
      border-left: 1px solid rgb(255,255,255, 0.5)

  @media (min-width: 1200px)
    .my-sticky-last-column-table
      thead tr:last-child th:last-child
        background-color: none
      td:last-child
        background-color: none

.my-sticky-last-column-table
  thead tr:last-child th:last-child

    background-color: white
  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    border-left: 1.5px solid rgb(000,000,000, 0.5 )
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
      border-left: none
      position: relative
      right: 0
      z-index: 0
</style>
