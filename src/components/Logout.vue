<template>
  <div>
    <q-btn label="Logout" @click="logout"></q-btn>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.clear();
      this.$keycloak.logoutFn({ logoutRedirectUri: window.location.host });
    },
  },
};
</script>

<style lang="scss" scoped></style>
