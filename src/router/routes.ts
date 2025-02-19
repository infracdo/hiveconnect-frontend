import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/inet-config",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: "inet-config",
        component: () => import("pages/InetConfig.vue"),
        meta: { roles: ["hive-connect-access"] },
      },

      {
        path: "rogue-devices",
        component: () => import("pages/ACSRougeTable.vue"),
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "network-address",
        component: () => import("pages/NetworkAddress.vue"),
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "network-address/:ipAddress",
        component: () => import("../components/NetworkAddress/IpAddresses.vue"),
        props: true,
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "provisioned",
        component: () => import("../pages/HiveProvisioned.vue"),
        props: true,
        meta: { roles: ["hive-connect-access"] },
      },
      {
        path: "troubleshooting",
        component: () => import("../pages/TroubleShooting.vue"),
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
