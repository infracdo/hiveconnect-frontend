import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      { path: "inet-config", component: () => import("pages/InetConfig.vue") },
      {
        path: "rogue-devices",
        component: () => import("pages/ACSRougeTable.vue"),
      },
      {
        path: "network-address",
        component: () => import("pages/NetworkAddress.vue"),
      },
      {
        path: "network-address/:ipAddress",
        component: () => import("../components/NetworkAddress/IpAddresses.vue"),
        props: true,
      },
      {
        path: "provisioned",
        component: () => import("../pages/HiveProvisioned.vue"),
        props: true,
      },
      {
        path: "troubleshooting",
        component: () => import("../pages/TroubleShooting.vue"),
        props: true,
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
