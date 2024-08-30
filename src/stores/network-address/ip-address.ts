import { defineStore } from 'pinia';
import { QTableProps } from 'quasar';
export const useIpAddressStore = defineStore('ip-address', {
  state: () => ({
    ipAddressDetail: {},
    ipAddressRow: [{}],
    ipAddressColumn: [
      {
        name: 'ipAddress',
        label: 'Ip Address',
        field: 'ipAddress',
        align: 'left',
        sortable: true,
      },
      {
        name: 'accountNumber',
        label: 'Account Number',
        field: 'accountNumber',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'left',
        sortable: true,
      },
      {
        name: 'notes',
        label: 'Notes',
        field: 'notes',
        align: 'left',
        sortable: true,
      },
      {
        name: 'Type',
        label: 'Type',
        field: 'type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'vlanId',
        label: 'Vlan ID',
        field: 'vlanId',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'left',
        sortable: true,
      },
    ] as QTableProps['columns'],
  }),
});
