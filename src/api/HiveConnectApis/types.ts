export interface IupdateClient {
  id: number;
  ipAddress: string;
  serialNum: string;
  olt: string;
  macaddress: string;
}

export interface IexecuteProvision {
  accNum: string;
  clientName: string;
  serialNum: string;
  macaddress: string;
  ipAddress: string;
  olt: string;
  packageType: string;
}

export interface IClient {
  newSubscriberId: number;
  bucketId: number;
  subscriberAccountNumber: string;
  subscriberName: string;
  ipAssigned: string;
  onuSerialNumber: string;
  oltIp: string;
  oltInterface: string;
  onuMacAddress: string;
  onuDeviceName: string;
  packageType: string;
  oltReportedUpstream: number;
  oltReportedDownstream: number;
  ssidName: string;
}

// added new interface for OLT IP
export interface IOltSiteByIp {
  newOltId: number;
  oltName: string;
  oltIp: string;
  oltNetworksite: string;
}

// added new interface for GroupedNetworkSite
export interface GroupedNetworkSite {
  oltNetworkSite: string;
  oltIps: string[];
}

export interface IRogueDevices {
  activated: string;
  date_created: string;
  date_modified: string;
  date_offline: string;
  device_name: string;
  device_type: string;
  id: number;
  location: string;
  mac_address: string;
  model: string;
  parent: string;
  serial_number: string;
  status: string;
}

export interface IipAddressesOfCidrBlock {
  id: number;
  ipAddress: string;
  status: string;
  accountNumber: string;
  type: string;
  vlanId: number;
  assignable: boolean;
  notes: string;
}

export interface IOltSiteByIp {
  newOltId: number;
  oltIp: string;
  oltName: string;
  oltNetworksite: string;
}

export interface IOlt {
  id: number;
  oltName: string;
  oltIp: string;
  nodeId: string;
}

export interface IPackageDetails {
  downstream: string;
  upstream: string;
  name: string;
  id: number;
  packageTypeId: string;
}
