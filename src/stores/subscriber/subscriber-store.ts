import { defineStore } from 'pinia';
import { QTableProps } from 'quasar';
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
      olt_interface: '',
    },
    modalIsOpen: false,
    subscribercolumns: [
      {
        name: 'id',
        label: 'ID',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'accountNumber',
        label: 'Account No.',
        field: 'accountNumber',
        align: 'left',
        sortable: true,
      },
      {
        name: 'clientName',
        label: 'Client Name',
        field: 'clientName',
        align: 'left',
        sortable: true,
      },
      {
        name: 'ipAssigned',
        label: 'IP Assigned',
        field: 'ipAssigned',
        align: 'left',
        sortable: true,
      },
      {
        name: 'onuSerialNumber',
        label: 'ONU Serial Number',
        field: 'onuSerialNumber',
        align: 'left',
        sortable: true,
      },
      {
        name: 'onuMacAddress',
        label: 'ONU Mac Address',
        field: 'onuMacAddress',
        align: 'left',
        sortable: true,
      },
      {
        name: 'oltIp',
        label: 'OLT IP',
        field: 'oltIp',
        align: 'left',
        sortable: true,
      },
      {
        name: 'packageTypeId',
        label: 'Package Type ID',
        field: 'packageTypeId',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Actions',
        field: '',
        align: 'left',
      },
    ] as QTableProps['columns'],
  }),
});
