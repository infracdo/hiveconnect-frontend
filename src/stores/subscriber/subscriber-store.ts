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
      align: 'left'

    },
    {
      name: 'acc_no',
      label: 'Account No.',
      field: 'acc_no',
      align: 'left'

    },
    {
      name: 'subscriber_name',
      label: 'Subscriber Name',
      field: 'subscriber_name',
      align: 'left'

    },
    {
      name: 'serial_number',
      label: 'Serial Number',
      field: 'serial_number',
      align: 'left'

    },
    {
      name: 'package_type',
      label: 'Package Type',
      field: 'package_type',
      align: 'left'

    },
    {
      name: 'olt_ip',
      label: 'OLT IP',
      field: 'olt_ip',
      align: 'left'

    },
    {
      name: 'olt_interface',
      label: 'OLT Interface',
      field: 'olt_interface',
      align: 'left'

    },
    {
      name: 'mode',
      label: 'Mode',
      field: 'mode',
      align: 'left'

    },
    {
      name: 'ssid',
      label: 'SSID',
      field: 'ssid',
      align: 'left'

    },
    {
      name: 'password',
      label: 'Password',
      field: 'password',
      align: 'left'

    },
    { name: 'actions', label: 'Actions', field: '', align: 'left' }] as QTableProps['columns']
  })

})
