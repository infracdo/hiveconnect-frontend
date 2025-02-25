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
        name: "inetconfig",
        component: () => import("pages/InetConfig.vue"),
        meta: { roles: ["HIVECONNECT_PROVISIONING_VIEW"] },
      },
      {
        path: "rogue-devices",
        name: "roguedevices",
        component: () => import("pages/ACSRougeTable.vue"),
        meta: { roles: ["HIVECONNECT_ROGUE_DEVICES_VIEW"] },
      },
      {
        path: "migration",
        name: "migration",
        component: () => import("pages/MigrationPage.vue"),
        meta: { roles: ["HIVECONNECT_MIGRATION_VIEW"] },
      },
      {
        path: "network-address",
        name: "network-address",
        component: () => import("pages/NetworkAddress.vue"),
        meta: { roles: ["HIVECONNECT_ADDRESSES_VIEW"] },
      },
      {
        path: "network-address/:ipAddress",
        name: "network-address-details",
        component: () => import("../components/NetworkAddress/IpAddresses.vue"),
        props: true,
        meta: { roles: ["HIVECONNECT_ADDRESSES_VIEW"] },
      },
      {
        path: "provisioned",
        name: "provisioned",
        component: () => import("../pages/HiveProvisioned.vue"),
        props: true,
        meta: { roles: ["HIVECONNECT_PROVISIONED_VIEW"] },
      },
      {
        path: "troubleshooting",
        name: "troubleshooting",
        component: () => import("../pages/TroubleShooting.vue"),
        props: true,
        meta: { roles: ["HIVECONNECT_TROUBLESHOOTING_VIEW"] },
      },
      // {
      //   path: "/:catchAll(.*)*",
      //   // component: () => import("pages/ErrorNotFound.vue"),
      //   redirect: "/inet-config",
      // },
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
