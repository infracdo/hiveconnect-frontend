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
        name: 'account_No',
        label: 'Account No.',
        field: 'account_No',
        align: 'left',
        sortable: true,
      },
      {
        name: 'client_name',
        label: 'Client Name',
        field: 'client_name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'ip_assigned',
        label: 'IP Assigned',
        field: 'ip_assigned',
        align: 'left',
        sortable: true,
      },
      {
        name: 'onu_serial_no',
        label: 'ONU Serial Number',
        field: 'onu_serial_no',
        align: 'left',
        sortable: true,
      },
      {
        name: 'onu_mac_address',
        label: 'ONU Mac Address',
        field: 'onu_mac_address',
        align: 'left',
        sortable: true,
      },
      {
        name: 'olt_ip',
        label: 'OLT IP',
        field: 'olt_ip',
        align: 'left',
        sortable: true,
      },
      {
        name: 'package_type_id',
        label: 'Package Type ID',
        field: 'package_type_id',
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
