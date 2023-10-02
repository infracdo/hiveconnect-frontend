import { defineStore } from 'pinia'
import { QTableProps } from 'quasar'
export const useNetworkStore = defineStore('network-address', {
  state: () => ({
    networkAddressDetail: {},

    networkColumn: [
      {
        name: 'networkAddress',
        label: 'Network Address',
        field: 'networkAddress',
        align: 'left',
        sortable: true

      },

      {
        name: 'account_No',
        label: 'Account Number',
        field: 'AccountNumber',
        align: 'left',
        sortable: true

      },
      {
        name: 'notes',
        label: 'Notes',
        field: 'notes',
        align: 'left',
        sortable: true

      },
      {
        name: 'site',
        label: 'Site',
        field: 'site',
        align: 'left',
        sortable: true

      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'left',
        sortable: true

      },
      {
        name: 'type',
        label: 'Type',
        field: 'type',
        align: 'left',
        sortable: true

      },
      {
        name: 'vlanId',
        label: 'Vlan ID',
        field: 'vlanId',
        align: 'left',
        sortable: true

      },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'left',
        sortable: true

      }
    ] as QTableProps['columns']
  })
})
