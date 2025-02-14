import axios from "axios";
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";
import {
  IClient,
  IRogueDevices,
  IipAddressesOfCidrBlock,
  IOltSiteByIp,
  IOlt,
  IPackageDetails,
} from "./types";
import { auth } from "src/stores/auth";
const store = useDevicesStore();
const kc = auth();

const API_BASE_URL = process.env.PROVISION_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  // baseURL: 'http://172.91.0.17:8888',
  timeout: 0,
});

// export const getDevices = async (): Promise<IRogueDevices[]> => {
//   try {
//     const { data } = await api.get("/getRogueDevices");
//     store.$patch({
//       rogueDevice: data,
//     });
//     return data;
//   } catch (error) {
//     // throw new Error("Could not retrieve rogue devices data!");
//   }
// };

export const getDevices = async (): Promise<IRogueDevices[]> => {
  try {
    console.log("front end accessing backend hive api /getRogueDevices");
    const { data } = await api.get("/getRogueDevices");
    store.$patch({
      rogueDevice: data,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Could not retrieve rogue devices data!");
  }
};

export const getIpAddresses = async (
  ipAddress: string | string[]
): Promise<IipAddressesOfCidrBlock[]> => {
  try {
    console.log(
      "front end accessing backend hive api /getIpAddressesOfCidrBlock"
    );
    const { data } = await api.get("/getIpAddressesOfCidrBlock/" + ipAddress);
    return data;
  } catch (error) {
    console.log("Cannot retrieve IP Address data!", error);
    throw error;
  }
};

export const getNetworkAddresses = async () => {
  try {
    console.log("front end accessing backend hive api /getallnetworks");
    const { data } = await api.get("/getallnetworks"); ///getCidrBlocks
    return data;
  } catch (error) {
    console.log("Cannot Retrieve Network Address Data!", error);
    throw error;
  }
};

export const getClients = async (): Promise<IClient[]> => {
  try {
    console.log("front end accessing backend hive api /getsubscribers");
    const { data } = await api.get("/getsubscribers"); //get new client from billing
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};
// added new api for OLT IP
export const getNetworkSiteOltIp = async (): Promise<IOltSiteByIp[]> => {
  try {
    console.log("front end accessing backend hive api /getallolt");
    const { data } = await api.get("/getallolt");
    return data;
  } catch (error) {
    console.log("Could not retrieve OLT SiteBy Ip Data!", error);
    throw error;
  }
};

export const getHiveClients = async (): Promise<IClient[]> => {
  try {
    console.log(
      "front end accessing backend hive api /getprovisionedsubscribers"
    );
    const { data } = await api.get("/getprovisionedsubscribers"); //"/getHiveClients"
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

export const getHiveclients = async (): Promise<IClient[]> => {
  try {
    const { data } = await api.get("/getHiveClients"); //"/getHiveClients"
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

export const getClientById = async (
  newsubscriberId: number
): Promise<IClient> => {
  try {
    const { data } = await api.get("/getsubscriberbyid/" + newsubscriberId);
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};
export const getHiveClientById = async (id: number): Promise<IClient> => {
  try {
    const { data } = await api.get("/getHiveClientById/" + id);
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};
export const updateClient = async (
  id: number,

  serialNum: string,
  olt: string,
  macaddress: string
) => {
  try {
    const { data } = await api.patch("/updateClient/" + id, {
      serialNumber: serialNum,
      olt: olt,
      macAddress: macaddress,
    });
    return data;
  } catch (error) {
    throw new Error("Could not update Client/Subscriber Data!");
  }
};

export const testError = async () => {
  const { data } = await api.post("/simulateHiveMonitoringError");
  return data;
};
// -- removed comment
export const executeProvision = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  newOltId: number,
  olt: string,
  packageType: string
  // downstream: number, //added
  // upstream: number, //added
) => {
  const { data } = await api.post("/executeProvision", {
    accountNo: accNum,
    clientName: clientName,
    serialNumber: serialNum,
    macAddress: macaddress,
    olt: olt,
    oltId: newOltId,
    packageType: packageType,
    // downstream: downstream, //added
    // upstream: upstream, //added
  });
  return data;
};
export const preProvisionCheck = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  olt: string,
  packageType: string,
  newOltId: number
  // downstream: number, //added
  // upstream: number, //added
) => {
  const { data } = await api.post("/preprovisionCheck", {
    accountNo: accNum,
    clientName: clientName,
    serialNumber: serialNum,
    macAddress: macaddress,
    olt: olt,
    oltId: newOltId,
    packageType: packageType,
    // downstream: downstream, //added
    // upstream: upstream, //added
  });
  return data;
};

export const executeAutoConfig = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  olt: string,
  packageType: string,
  newOltId: number
  // downstream: number,
  // upstream: number
) => {
  const { data } = await api.post("/executeAutoConfig", {
    accountNo: accNum,
    clientName: clientName,
    serialNumber: serialNum,
    macAddress: macaddress,
    olt: olt,
    packageType: packageType,
    oltId: newOltId,
    // downstream: downstream, //added
    // upstream: upstream, //added
  });
  return data;
};
export const executeMonitoring = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  olt: string,
  packageType: string,
  newOltId: number
  // downstream: number,
  // upstream: number
) => {
  const { data } = await api.post("/executeMonitoring", {
    accountNo: accNum,
    clientName: clientName,
    serialNumber: serialNum,
    macAddress: macaddress,
    olt: olt,
    oltId: newOltId,
    packageType: packageType,
    // downstream: downstream, //added
    // upstream: upstream, //added
  });
  return data;
};

export const addNewClient = async (
  accNum: string,
  packageType: string,
  serialNum: string,
  macAddress: string,
  oltIp: string,
  downstream: string,
  upstream: string
) => {
  const { data } = await api.post("/addNewClient", {
    AccountID: accNum,
    OltIP: oltIp,
    ONUSerialNum: serialNum,
    PackageType: packageType,
    ONUMacAddress: macAddress,
    downstream: downstream, //added
    upstream: upstream, //added
  });
  return data;
};

export const getOneAvailableIpAddress = async () => {
  try {
    const { data } = await api.get("/getOneAvailableIpAddress");
    return data;
  } catch (error) {
    console.log("Could not get One Available IpAddress Data!", error);
    throw error;
  }
};

export const checkPackageDetails = async (
  packageTypeId: string
): Promise<IPackageDetails> => {
  try {
    const { data } = await api.get("/checkPackageDetails/" + packageTypeId);
    return data;
  } catch (error) {
    console.log("Could not retrieve Bandwidth Data!", error);
    throw error;
  }
};

export const checkOltSiteByIp = async (
  oltIp: string
): Promise<IOltSiteByIp> => {
  try {
    const { data } = await api.get("/checkOltSiteByIp/" + oltIp);
    return data;
  } catch (error) {
    console.log("Could not retrieve OLT SiteBy Ip Data!", error);
    throw error;
  }
};

// export const checkOltInterface = async (deviceName: string) => {
//   try {
//     const { data } = await api.get("/checkOltInterface/" + deviceName);
//     return data;
//   } catch (error) {
//     console.log("Could not retrieve Olt Interface Data!", error);
//     throw error;
//   }
// };

export const getAllOlts = async (): Promise<IOlt[]> => {
  const { data } = await api.get("/getAllOlts");
  return data;
};

export const getOtcStatus = async (clientId: number) => {
  const { data } = await api.get("/getOtcStatus/" + clientId);
  return data;
};
