export interface IdeviceType {
  id: number;
  device_name: string;
  mac_address: string;
  serial_number: string;
  location: string;
  parent: string;
  date_created: string;
  date_modified: string;
  date_offline: string;
  activated: boolean;
  status: string;
  model: string;
  device_type: string;
}

export interface IsubsriberType {
  id?: number | string;
  acc_no: string;
  subscriber_name: string;
  serial_number: string;
  package_type: string;
  olt_ip: string;
  olt_interface: string;
  ssid: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}
