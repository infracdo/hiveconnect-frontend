<template>
  <q-item clickable @click="logout" class="item-padding">
    <q-item-section avatar>
      <div class="row items-center">
        <q-icon name="bi-box-arrow-right" size="20px" class="q-mr-md" />
        <q-item-label>Logout</q-item-label>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  methods: {
    logout() {
      console.log("logout");
      localStorage.clear();
      this.$keycloak.logoutFn({ logoutRedirectUri: window.location.host });
    },
  },
};
</script>

<style lang="scss" scoped>
.item-padding {
  padding-left: 18px;
}
</style>
