import { boot, route } from "quasar/wrappers";
import VueKeyCloak from "@dsb-norge/vue-keycloak-js";
import Keycloak from "keycloak-js";
import axios from "axios";
import { auth } from "src/stores/auth";
import { VueKeycloakOptions } from "@dsb-norge/vue-keycloak-js/dist/types";
import routes from "src/router/routes";

const store = auth();

const keycloak = new Keycloak({
  url: "https://wcdssi.apolloglobal.net:8443/auth",
  realm: "workconnect-test",
  clientId: "test-hiveconnect-frontend",
});

console.log("KeycloakURL", process.env.VUE_APP_KEYCLOAK_URL);
console.log("KeycloakRealm", process.env.VUE_APP_KEYCLOAK_REALM);
console.log("KeycloakClientId", process.env.VUE_APP_KEYCLOAK_CLIENT_ID);

export default boot(({ app, router }) => {
  let isKeycloakInitialized = false;

  keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
      enableLogging: true,
    })
    .then((authenticated) => {
      if (authenticated) {
        app.config.globalProperties.$keycloak = keycloak;
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + keycloak.token;

        const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
        const resourceRoles =
          (keycloak.tokenParsed?.resource_access["test-hiveconnect-frontend"]
            .roles as string[]) || [];
        app.config.globalProperties.$userRoles = realmRoles;
        app.config.globalProperties.$resourceRoles = resourceRoles;

        console.log("User authenticated", keycloak.token);
        store.setKeycloak(keycloak);
        store.setUserProfile();
        isKeycloakInitialized = true;

        // add code to go to accessible route
        for (const route of routes) {
          // Check child routes
          if (route.children) {
            for (const child of route.children) {
              if (
                child.meta?.roles &&
                child.meta.roles.some((role) => resourceRoles.includes(role))
              ) {
                // Redirect to the first matching route
                router.push(child.path);
                return; // Exit after the first match
              }
            }
          }

          // Check the current route
          if (
            route.meta?.roles &&
            route.meta.roles.some((role) => resourceRoles.includes(role))
          ) {
            // Redirect to the first matching route
            router.push(route.path);
            return; // Exit after the first match
          }
        }
      } else {
        console.warn("User not authenticated");
      }
    })
    .catch((error) => {
      console.error("Keycloak initialization failed:", error);
    });

  router.beforeEach((to, from, next) => {
    if (!isKeycloakInitialized) {
      return next(false);
    }

    if (to.meta.requiresAuth !== false && !keycloak.authenticated) {
      keycloak.login();
      return;
    }

    const userRoles = app.config.globalProperties.$userRoles as string[];
    const resourceRoles = keycloak.tokenParsed?.resource_access[
      "test-hiveconnect-frontend"
    ].roles as string[];

    if (
      (to.meta.requiredRoles as string[])?.some(
        (role) => !resourceRoles.includes(role)
      )
    ) {
      console.warn("Access denied: Insufficient role");
      next("/unauthorized");
    }

    console.log("User roles", app.config.globalProperties.$userRoles);
    console.log("Resource roles", app.config.globalProperties.$resourceRoles);

    // add code that checks if user is allowed to access the route
    if (
      to.meta?.roles &&
      to.meta.roles.some((role) => resourceRoles.includes(role))
    ) {
      // Redirect to the first matching route
      next(); // Exit after the first match
    } else {
      next(false);
    }
  });
});

// export default boot(async ({ app, router }) => {
//   async function tokenInterceptor() {
//     axios.interceptors.request.use(
//       (config) => {
//         config.headers.Authorization = `Bearer ${app.config.globalProperties.$keycloak.token}`;
//         config.url = process.env.PROVISION_API_URL;
//         return config;
//       },
//       (error) => {
//         return Promise.reject(error);
//       }
//     );
//   }

//   localStorage.realm = "login";

//   if (localStorage.realm == "login") {
//     return new Promise((resolve) => {
//       localStorage.realm = "";
//       app.use(VueKeyCloak, {
//         init: {
//           onLoad: "login-required", // or 'check-sso'
//           // flow: 'standard',
//           // pkceMethod: 'S256',//silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//           checkLoginIframe: false, // otherwise it would reload the window every so seconds
//         },

//         config: {
//           url: process.env.VUE_APP_KEYCLOAK_URL,
//           realm: process.env.VUE_APP_KEYCLOAK_REALM,
//           clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
//         },
//         onReady: (keycloak) => {
//           tokenInterceptor();
//           store.setKeycloak(keycloak);
//           store.setUserProfile();
//           console.log(store.keycloak);
//           resolve();
//         },
//       });
//     });
//   } else {
//     return new Promise((resolve) => {
//       app.use(VueKeyCloak, {
//         init: {
//           onLoad: "check-sso", // or 'check-sso'
//           // flow: 'standard',
//           // pkceMethod: 'S256',//silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//           checkLoginIframe: false, // otherwise it would reload the window every so seconds
//         },

//         config: {
//           url: process.env.VUE_APP_KEYCLOAK_URL,
//           realm: process.env.VUE_APP_KEYCLOAK_REALM,
//           clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
//         },
//         onReady: (keycloak) => {
//           tokenInterceptor();
//           store.setKeycloak(keycloak);
//           store.setUserProfile();
//           console.log(store);
//           resolve();
//         },
//       });
//     });
//   }
// });

export { keycloak };
