import { defineStore } from "pinia";

export const auth = defineStore("keycloak", {
  state: () => ({
    UserProfile: { firstName: "", lastName: "", username: "" },
    keycloak: {},
    isNotClient: false,
  }),
  getters: {
    getName(state) {
      console.log(this.keycloak);
      if (this.UserProfile.firstName != undefined) {
        if (this.UserProfile.firstName.includes("@"))
          return (
            this.UserProfile.firstName.split("@")[0] +
            " " +
            this.UserProfile.lastName.split("@")[0]
          );
        else
          return this.UserProfile.firstName + " " + this.UserProfile.lastName;
      } else return this.UserProfile.username;
    },
  },
  actions: {
    setKeycloak(payload) {
      this.$state.keycloak = payload;
    },
    async setUserProfile() {
      this.$state.UserProfile = await this.$state.keycloak.loadUserProfile();
    },
  },
});
