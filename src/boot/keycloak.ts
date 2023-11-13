import { boot } from "quasar/wrappers";
import VueKeyCloak from "@dsb-norge/vue-keycloak-js";
import axios from "axios";
import { auth } from "src/stores/auth";
import { VueKeycloakOptions } from "@dsb-norge/vue-keycloak-js/dist/types";

const store = auth();

console.log("KeycloakURL", process.env.VUE_APP_KEYCLOAK_URL);
console.log("KeycloakRealm", process.env.VUE_APP_KEYCLOAK_REALM);
console.log("KeycloakCLientId", process.env.VUE_APP_KEYCLOAK_CLIENT_ID);

export default boot(async ({ app, router }) => {
  async function tokenInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${app.config.globalProperties.$keycloak.token}`;
        config.url = process.env.PROVISION_API_URL;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  localStorage.realm = "login";

  if (localStorage.realm == "login") {
    return new Promise((resolve) => {
      localStorage.realm = "";
      app.use(VueKeyCloak, {
        init: {
          onLoad: "login-required", // or 'check-sso'
          // flow: 'standard',
          // pkceMethod: 'S256',//silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false, // otherwise it would reload the window every so seconds
        },

        config: {
          url: process.env.VUE_APP_KEYCLOAK_URL,
          realm: process.env.VUE_APP_KEYCLOAK_REALM,
          clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
        },
        onReady: (keycloak) => {
          tokenInterceptor();
          store.setKeycloak(keycloak);
          store.setUserProfile();
          console.log(store.keycloak);
          resolve();
        },
      });
    });
  } else {
    return new Promise((resolve) => {
      app.use(VueKeyCloak, {
        init: {
          onLoad: "check-sso", // or 'check-sso'
          // flow: 'standard',
          // pkceMethod: 'S256',//silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false, // otherwise it would reload the window every so seconds
        },

        config: {
          url: process.env.VUE_APP_KEYCLOAK_URL,
          realm: process.env.VUE_APP_KEYCLOAK_REALM,
          clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
        },
        onReady: (keycloak) => {
          tokenInterceptor();
          store.setKeycloak(keycloak);
          store.setUserProfile();
          console.log(store);
          resolve();
        },
      });
    });
  }
});
