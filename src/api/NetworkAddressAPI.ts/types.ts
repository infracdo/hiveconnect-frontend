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

export interface IaddNewClient {
  accNum: string;
  packageType: string;
  serialNum: string;
  macAddress: string;
  oltIp: string;
  ipAssigned: string;
}
