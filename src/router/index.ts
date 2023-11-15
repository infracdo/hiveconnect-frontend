import { route } from "quasar/wrappers";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import routes from "./routes";
import { auth } from "src/stores/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Router.beforeEach(async (to, from, next) => {
  //   // canUserAccess() returns `true` or `false`
  //   // console.log(to.meta.requiresAuth)
  //   console.log(store.state.value.keycloak.keycloak.authenticated);
  //   if (store.state.value.keycloak.keycloak.authenticated) {
  //     var routeRoles = [];
  //     if (to.meta.roles != undefined) routeRoles = to.meta.roles;
  //     if (
  //       !routeRoles.some((x) =>
  //         store.state.value.keycloak.keycloak.hasRealmRole(x)
  //       ) &&
  //       !routeRoles.includes("any") &&
  //       to.path != "/401" &&
  //       routeRoles.length > 0
  //     ) {
  //       next("/401"); // Redirect to '/401' path
  //     } else {
  //       if (to.path == "/Login") {
  //         next({ path: "/" });
  //       } else next(); // Continue navigation to the desired page
  //     }
  //   } else {
  //     if (to.path !== "/Login") {
  //       next({ path: "/Login" }); // Redirect to '/Login' path
  //     } else {
  //       next(); // Allow navigation to the destination since we're already on the redirect path
  //     }
  //   }
  // });

  return Router;
});
