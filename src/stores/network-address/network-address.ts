import { defineStore } from 'pinia'
import { QTableProps } from 'quasar'
export const useNetworkStore = defineStore('network-address', {
  state: () => ({
    networkAddressDetail: {},
    networkRow: [{
      id: 1,
      NetworkAddress: '192.168.2.0',
      AccountNumber: ' ',
      VlanID: '104',
      Site: 'Gingoog',
      Type: 'Enterprise',
      Status: 'Unavailable',
      Notes: 'Office Now, Croconopia'
    }],
    networkColumn: [{
      name: 'id',
      label: 'ID',
      field: 'id',
      align: 'left'

    },
    {
      name: 'account_No',
      label: 'Account Number',
      field: 'AccountNumber',
      align: 'left'

    },
    {
      name: 'networkAddress',
      label: 'Network Address',
      field: 'networkAddress',
      align: 'left'

    },
    {
      name: 'notes',
      label: 'Notes',
      field: 'notes',
      align: 'left'

    },
    {
      name: 'site',
      label: 'Site',
      field: 'site',
      align: 'left'

    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'left'

    },
    {
      name: 'type',
      label: 'Type',
      field: 'type',
      align: 'left'

    },
    {
      name: 'vlanId',
      label: 'Vlan ID',
      field: 'vlanId',
      align: 'left'

    }
    ] as QTableProps['columns']
  })
})
