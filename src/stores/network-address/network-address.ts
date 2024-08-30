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
        name: 'cidrBlock',
        label: 'CIDR BLOCK',
        field: 'cidrBlock',
        align: 'left',
        sortable: true

      },
      {
        name: 'default_gateway',
        label: 'DEFAULT GATEWAY',
        field: 'defaultGateway',
        align: 'left',
        sortable: true

      },
      {
        name: 'notes',
        label: 'Notes',
        field: 'location',
        align: 'left',
        sortable: true

      },
      {
        name: 'site',
        label: 'Site',
        field: 'networkName',
        align: 'left',
        sortable: true

      },
      {
        name: 'type',
        label: 'Type',
        field: 'networkType',
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
