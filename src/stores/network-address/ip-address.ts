import { defineStore } from 'pinia'
import { QTableProps } from 'quasar'
export const useIpAddressStore = defineStore('ip-address', {
  state: () => ({

    ipAddressDetail: {},
    ipAddressRow: [{

    }],
    ipAddressColumn: [
      {
        name: 'ipAddress',
        label: 'Ip Address',
        field: 'ipAddress',
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
        name: 'status',
        label: 'Status',
        field: 'status',
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
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'left',
        sortable: true

      }

    ] as QTableProps['columns']
  })
})
