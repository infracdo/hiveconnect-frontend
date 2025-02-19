import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/inet-config",
    component: () => import("layouts/MainLayoutReskin.vue"),

    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: "inet-config",
        component: () => import("pages/HiveReskin/InetConfigReskin.vue"),
        meta: { roles: ["hive-connect-access"] },
      },

      {
        path: "rogue-devices",
        component: () => import("pages/HiveReskin/ACSRougeTableReskin.vue"),
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "network-address",
        component: () => import("pages/HiveReskin/NetworkAddressReskin.vue"),
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "network-address/:ipAddress",
        component: () =>
          import("../components/NetworkAddress/IpAddressesReskin.vue"),
        props: true,
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "provisioned",
        component: () =>
          import("../pages/HiveReskin/HiveProvisionedReskin.vue"),
        props: true,
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "troubleshooting",
        component: () =>
          import("../pages/HiveReskin/TroubleShootingReskin.vue"),
        props: true,
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "/:catchAll(.*)*",
        // component: () => import("pages/ErrorNotFound.vue"),
        redirect: "/inet-config",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
