import axios from "axios";
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";
const store = useDevicesStore();

const API_BASE_URL = process.env.PROVISION_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 0,
});

export const getDevices = async () => {
  try {
    const response = await api.get("/getRogueDevices");
    store.$patch({
      rogueDevice: response.data,
    });
    return response.data;
  } catch (error) {
    throw new Error("Could not retrieve rogue devices data!");
  }
};

export const getIpAddresses = async (ipAddress: string | string[]) => {
  try {
    const response = await api.get("/getIpAddressesOfCidrBlock/" + ipAddress);
    return response.data;
  } catch (error) {
    console.log("Cannot retrieve IP Address data!", error);
    throw error;
  }
};

export const getNetworkAddresses = async () => {
  try {
    const response = await api.get("/getCidrBlocks");
    return response.data;
  } catch (error) {
    console.log("Cannot Retrieve Network Address Data!", error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await api.get("/getClients");
    return response.data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};
export const getClientById = async (id: number) => {
  try {
    const response = await api.get("/getClientById/" + id);
    return response.data;
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
    const response = await api.patch("/updateClient/" + id, {
      serialNumber: serialNum,
      olt: olt,
      macAddress: macaddress,
    });
    return response.data;
  } catch (error) {
    throw new Error("Could not update Client/Subscriber Data!");
  }
};

// export const executeProvision = async (
//   accNum: string,
//   clientName: string,
//   serialNum: string,
//   macaddress: string,

//   olt: string,
//   packageType: string
// ) => {
//   const response = await api.post("/executeProvision", {
//     accountNo: accNum,
//     clientName: clientName,
//     serialNumber: serialNum,
//     macAddress: macaddress,
//     olt: olt,
//     packageType: packageType,
//   });
//   return response.data;
// };
export const executeAutoConfig = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  olt: string,
  packageType: string
) => {
  const response = await api.post("/executeAutoConfig", {
    accountNo: accNum,
    clientName: clientName,
    serialNumber: serialNum,
    macAddress: macaddress,
    olt: olt,
    packageType: packageType,
  });
  return response.data;
};
export const executeMonitoring = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  olt: string,
  packageType: string
) => {
  const response = await api.post("/executeMonitoring", {
    accountNo: accNum,
    clientName: clientName,
    serialNumber: serialNum,
    macAddress: macaddress,
    olt: olt,
    packageType: packageType,
  });
  return response.data;
};

export const addNewClient = async (
  accNum: string,
  packageType: string,
  serialNum: string,
  macAddress: string,
  oltIp: string
) => {
  const response = await api.post("/addNewClient", {
    AccountID: accNum,
    OltIP: oltIp,
    ONUSerialNum: serialNum,
    PackageType: packageType,
    ONUMacAddress: macAddress,
  });
  return response.data;
};

export const getOneAvailableIpAddress = async () => {
  try {
    const response = await api.get("/getOneAvailableIpAddress");
    return response.data;
  } catch (error) {
    console.log("Could not get One Available IpAddress Data!", error);
    throw error;
  }
};

export const checkPackageBandwidth = async (packageType: string) => {
  try {
    const response = await api.get("/checkPackageBandwidth/" + packageType);
    return response.data;
  } catch (error) {
    console.log("Could not retrieve Bandwidth Data!", error);
    throw error;
  }
};

export const checkOltSiteByIp = async (oltIp: string) => {
  try {
    const response = await api.get("/checkOltSiteByIp/" + oltIp);
    return response.data;
  } catch (error) {
    console.log("Could not retrieve OLT SiteBy Ip Data!", error);
    throw error;
  }
};

export const checkOltInterface = async (deviceName: string) => {
  try {
    const response = await api.get("/checkOltInterface/" + deviceName);
    return response.data;
  } catch (error) {
    console.log("Could not retrieve Olt Interface Data!", error);
    throw error;
  }
};
