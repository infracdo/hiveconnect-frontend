import { defineStore } from "pinia";
import { QTableProps } from "quasar";
import { networkAddressType } from "src/components/models";
export const useNetworkStore = defineStore("network-address", {
  state: () => ({
    networkAddressDetail: [] as networkAddressType[],
    networkColumn: [
      {
        name: "networkAddress",
        label: "Network Address",
        field: "networkAddress",
        align: "left",
        sortable: true,
      },
      {
        name: "cidrBlock",
        label: "CIDR BLOCK",
        field: "cidrBlock",
        align: "left",
        sortable: true,
      },
      {
        name: "defaultGateway",
        label: "DEFAULT GATEWAY",
        field: "defaultGateway",
        align: "left",
        sortable: true,
      },
      {
        name: "location",
        label: "Notes",
        field: "location",
        align: "left",
        sortable: true,
      },
      {
        name: "networkName",
        label: "Site",
        field: "networkName",
        align: "left",
        sortable: true,
      },
      {
        name: "networkType",
        label: "Type",
        field: "networkType",
        align: "left",
        sortable: true,
      },
      {
        name: "vlanId",
        label: "Vlan ID",
        field: "vlanId",
        align: "left",
        sortable: true,
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left",
        sortable: true,
      },
    ] as QTableProps["columns"],
  }),
});
