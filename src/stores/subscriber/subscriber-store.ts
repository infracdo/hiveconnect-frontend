import { defineStore } from 'pinia'
import { QTableProps } from 'quasar'
export const useSubscriberStore = defineStore('subsciber', {
  state: () => ({
    subscriberDetail: {
      subscriber_name: '',
      serial_number: '',
      acc_no: '',
      package_type: '',
      ssid: '',
      password: '',
      mode: '',
      olt_ip: '',
      olt_interface: ''
    },
    modalIsOpen: false,
    subscribercolumns: [{
      name: 'id',
      label: 'ID',
      field: 'id',
      align: 'left',
      sortable: true

    },
    {
      name: 'acc_no',
      label: 'Account No.',
      field: 'acc_no',
      align: 'left',
      sortable: true

    },
    {
      name: 'subscriber_name',
      label: 'Subscriber Name',
      field: 'subscriber_name',
      align: 'left',
      sortable: true

    },
    {
      name: 'serial_number',
      label: 'Serial Number',
      field: 'serial_number',
      align: 'left',
      sortable: true

    },
    {
      name: 'package_type',
      label: 'Package Type',
      field: 'package_type',
      align: 'left',
      sortable: true

    },
    {
      name: 'olt_ip',
      label: 'OLT IP',
      field: 'olt_ip',
      align: 'left',
      sortable: true

    },
    {
      name: 'olt_interface',
      label: 'OLT Interface',
      field: 'olt_interface',
      align: 'left',
      sortable: true

    },
    {
      name: 'mode',
      label: 'Mode',
      field: 'mode',
      align: 'left',
      sortable: true

    },
    {
      name: 'ssid',
      label: 'SSID',
      field: 'ssid',
      align: 'left',
      sortable: true

    },
    {
      name: 'password',
      label: 'Password',
      field: 'password',
      align: 'left',
      sortable: true

    },
    { name: 'actions', label: 'Actions', field: '', align: 'left' }] as QTableProps['columns']
  })

})
