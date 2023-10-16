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
  id: number;
  accountNumber: string;
  clientName: string;
  ipAssigned: string;
  onuSerialNumber: string;
  oltIp: string;
  onuMacAddress: string;
  packageTypeId: string;
  onuDeviceName: string;
  created_at?: string;
  updated_at?: string;
}

export interface IrowIpAddress {
  id: number;
  ipAddress: string;
  status: string;
  account_No: string;
  vlanId: number;
  assignable: string;
  notes: string;
}
export interface IserialAndMac {
  serial_number: string;
  mac_address: string;
}

export interface rogueDeviceType {
  id: number;
  device_name: string;
  mac_address: string;
  serial_number: string;
  location: string;
  parent: string;
  date_created: string;
  date_offline: string;
  activated: string;
  status: string;
  model: string;
  device_type: string;
}
