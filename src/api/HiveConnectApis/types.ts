// Data type for subscribers (either new, active, onhold)
export interface ISubscribers {
  newSubscriberId: number; // REVIEW: double check these redundant ids
  id: number;
  bucketId: number;
  subscriberAccountNumber: string;
  clientName: string;
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
  status: string;
}

// Data type for subscribers for migration
export interface IMigrationSubscriber {
  id: number;
  subscriberAccountNumber: string;
  clientName: string;
  ipAssigned: string;
  onuSerialNumber: string;
  site: number;
  oltIp: string;
  oltInterface: string;
  onuMacAddress: string;
  onuDeviceName: string;
  packageType: string;
  oltReportedUpstream: string;
  oltReportedDownstream: string;
  provision: string;
  status: string;
  ssidName: string;
}

// Data type for subscriber provisioning
// NOTE: still not used in provisioning subscriber
export interface ISubscriberProvision {
  accountNo: string;
  clientName: string;
  serialNumber: string;
  macAddress: string;
  olt: string;
  oltId: number;
  packageType: string;
  location: string;
}

// Data type for OLT sites
export interface IOltSites {
  newOltId: number;
  // newoltId: number;
  oltName: string;
  oltIp: string;
  oltNetworksite: string;
}

// Data type for rogue devices
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

// Data type for network addresses (addresses)
export interface INetworkAddresses {
  id: number;
  networkAddress: string;
  cidrBlock: string;
  defaultGateway: string;
  location: string;
  networkName: string;
  networkType: string;
  vlanId: string;
}

// Data type for IP addresses per CIDR block
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

// Data type for package details
export interface IPackageDetails {
  downstream: string;
  upstream: string;
  name: string;
  id: number;
  packageTypeId: string;
}

// Data type for OLT sites grouped by network sites
export interface IOltSitesByNetworkSites {
  oltNetworksite: string;
  oltIps: {
    id: number; // REVIEW: what is this for? the newOltId should already be the id of the olt sites
    oltIp: string;
    oltName: string;
    newOltId: number;
  }[];
}
