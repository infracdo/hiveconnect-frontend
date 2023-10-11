import { defineStore } from 'pinia';
import { QTableProps } from 'quasar';
import { rogueDeviceType } from 'src/components/models';
export const useDevicesStore = defineStore('devices', {
  state: () => ({
    rogueDevice: [] as rogueDeviceType[],
    devicesColumn: [
      {
        name: 'device_name',
        label: 'Device Name',
        field: 'device_name',
        align: 'left',
      },
      {
        name: 'mac_address',
        label: 'Mac Address',
        field: 'mac_address',
        align: 'left',
      },
      {
        name: 'serial_number',
        label: 'Serial Number',
        field: 'serial_number',
        align: 'left',
      },
      {
        name: 'location',
        label: 'Location',
        field: 'location',
        align: 'left',
      },
      {
        name: 'parent',
        label: 'Parent',
        field: 'parent',
        align: 'left',
      },
      {
        name: 'date_created',
        label: 'Date Created',
        field: 'date_created',
        align: 'left',
      },
      {
        name: 'date_modified',
        label: 'Date Modified',
        field: 'date_modified',
        align: 'left',
      },
      {
        name: 'date_offline',
        label: 'Date Offline',
        field: 'date_offline',
        align: 'left',
      },
      {
        name: 'activated',
        label: 'Activated',
        field: 'activated',
        align: 'left',
      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'left',
      },
      {
        name: 'model',
        label: 'Model',
        field: 'model',
        align: 'left',
      },

      {
        name: 'device_type',
        label: 'Device Type',
        field: 'device_type',
        align: 'left',
      },
    ] as QTableProps['columns'],
  }),
});
