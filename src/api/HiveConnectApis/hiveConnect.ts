import axios, { isAxiosError } from "axios";
import { AxiosError } from "axios";
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";
import { useNetworkStore } from "src/stores/network-address/network-address";
import {
  IClient,
  IRogueDevices,
  IipAddressesOfCidrBlock,
  IOltSiteByIp,
  IOlt,
  IPackageDetails,
  INetworkAddresses,
} from "./types";
import { keycloak } from "src/boot/keycloak";
import { auth } from "src/stores/auth";
const deviceStore = useDevicesStore();
const networkStore = useNetworkStore();
const kc = auth();

const API_BASE_URL = process.env.PROVISION_API_URL;
const JWT_TOKEN = import.meta.env.VITE_PROVISION_BEARER_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  // baseURL: 'http://172.91.0.17:8888',
  timeout: 0,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${JWT_TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

//* AUTO PROVISION APIs *//

// POST: /preprovisionCheck
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

  console.log("Accessing '/preprovisionCheck' api:", data);
  return data;
};

// POST: /executeAutoConfig
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

  console.log("Accessing '/executeAutoConfig' api:", data);
  return data;
};

// POST: /executeMonitoring
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

  console.log("Accessing '/executeMonitoring' api:", data);
  return data;
};

//==============================================================================================

//* SUBSCRIBER APIs *//

//<-------------------------- HIVE/FOR PROVISION ------------------------------------->
// GET: /getsubscribers
export const getClients = async (): Promise<IClient[]> => {
  try {
    console.log("front end accessing backend hive api /getsubscribers");
    const { data } = await api.get("/getsubscribers", {
      params: {
        action: "api call - Subscribers for Provisioning page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    }); //get new client from billing
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

// GET: /getprovisionedsubscribers - UNUSED FUNCTION
export const getProvisionedHiveClients = async (): Promise<IClient[]> => {
  try {
    const { data } = await api.get("/getprovisionedsubscribers", {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    }); //"/getHiveClients"
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

// GET: /getHiveClients
export const getHiveclients = async (): Promise<IClient[]> => {
  try {
    const { data } = await api.get("/getHiveClients", {
      params: {
        action: "api call - Troubleshoot page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    }); //"/getHiveClients"
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

// GET: /getsubscriberbyid/{id}
export const getClientById = async (
  newsubscriberId: number
): Promise<IClient> => {
  try {
    const { data } = await api.get("/getsubscriberbyid/" + newsubscriberId, {
      params: {
        action: "api call - Provision Subscriber modal",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

// GET: /getHiveClientById/{id} - UNUSED FUNCTION
export const getHiveClientById = async (id: number): Promise<IClient> => {
  try {
    const { data } = await api.get("/getHiveClientById/" + id, {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    return data;
  } catch (error) {
    console.log("Could not retrieve Client/Subscriber Data!", error);
    throw error;
  }
};

//<-------------------------- FOR MIGRATION ------------------------------------->
// GET: /getmigratingsubscribers
export const getForMigrationSubscribers = async () => {
  try {
    const { data } = await api.get("/getmigratingsubscribers", {
      params: {
        action: "api call - Subscribers for Migration page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by triggering '/getmigratingsubscribers': ",
      data
    );
    return data;
  } catch (error) {
    console.log("Could not retrieve For Migration Subscribers data!", error);
    throw error;
  }
};

// POST: /updateMigrationSubscriberStatus
export const updateMigrationSubscriberStatus = async (accountNo: string) => {
  try {
    const { data } = await api.post("/updateMigrationSubscriberStatus", {
      subscriberAccountNumber: accountNo,
    });
    console.log(
      "Returned data by triggering '/updateMigrationSubscriberStatus' API: ",
      data
    );
    return data;
  } catch (error) {
    console.log("Could not update for migration subscriber status", error);

    if (isAxiosError(error) && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    } else {
      throw error;
    }
  }
};

// POST: /executeMigration
export const migrateSubscriberFromBucketToHive = async (accountNo: string) => {
  try {
    const { data } = await api.post("/executeMigration", {
      accountNo: accountNo,
    });
    console.log("Subscriber Account No: ", accountNo);
    console.log("Returned data by triggering '/executeMigration' API: ", data);
    return data;
  } catch (error) {
    console.log("Could not migrate subscriber for migration", error);
    throw error;
  }
};

//==============================================================================================

//* OLT APIs *//

// GET: /getallolt
// added new api for OLT IP
export const getNetworkSiteOltIp = async (): Promise<IOltSiteByIp[]> => {
  try {
    console.log("front end accessing backend hive api /getallolt");
    const { data } = await api.get("/getallolt", {
      params: {
        action: "api call - Subscribers for Provisioning page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    return data;
  } catch (error) {
    console.log("Could not retrieve OLT SiteBy Ip Data!", error);
    throw error;
  }
};

// GET: /getOltByIp/{oltIp} - UNUSED FUNCTION
export const checkOltSiteByIp = async (
  oltIp: string
): Promise<IOltSiteByIp> => {
  try {
    const { data } = await api.get("/checkOltSiteByIp/" + oltIp, {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    return data;
  } catch (error) {
    console.log("Could not retrieve OLT SiteBy Ip Data!", error);
    throw error;
  }
};

//==============================================================================================

//* ACS APIs *//

// GET: /getRogueDevices
export const getRogueDevices = async (): Promise<IRogueDevices[]> => {
  try {
    console.log("front end accessing backend hive api /getRogueDevices");
    const { data } = await api.get("/getRogueDevices", {
      params: {
        action: "api call - Rogue Devices page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    deviceStore.$patch({
      rogueDevice: data,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Could not retrieve rogue devices data!");
  }
};

// GET: /getdevices
export const getDevices = async (): Promise<IRogueDevices[]> => {
  try {
    const { data } = await api.get("/getRogueDevices", {
      params: {
        action: "api call - Provision Subscriber modal",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    deviceStore.$patch({
      rogueDevice: data,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Could not retrieve rogue devices data!");
  }
};

//==============================================================================================

//* DHCP APIs *//

// GET: /getIpAddressesOfCidrBlock/{cidrBlock}
export const getIpAddresses = async (
  ipAddress: string | string[]
): Promise<IipAddressesOfCidrBlock[]> => {
  try {
    console.log(
      "front end accessing backend hive api /getIpAddressesOfCidrBlock/" +
        ipAddress
    );
    const { data } = await api.get("/getIpAddressesOfCidrBlock/" + ipAddress, {
      params: {
        action: "api call - Network IP Addresses page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });

    console.log("Fetched getIpAddresses data:", data);
    return data;
  } catch (error) {
    console.log("Cannot retrieve IP Address data!", error);
    throw error;
  }
};

// GET: /getallnetworks
export const getNetworkAddresses = async (): Promise<INetworkAddresses[]> => {
  try {
    console.log("front end accessing backend hive api /getallnetworks");
    const { data } = await api.get("/getallnetworks", {
      params: {
        action: "api call - Addresses page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    }); ///getCidrBlocks
    networkStore.$patch({
      networkAddressDetail: data,
    });
    return data;
  } catch (error) {
    console.log("Cannot Retrieve Network Address Data!", error);
    throw new Error("Could not retrieve network addresses data!");
  }
};

//==============================================================================================

//* PACKAGE TYPE APIs *//

// GET: /checkPackageDetails/{packageType} - UNUSED FUNCTION
export const checkPackageDetails = async (
  packageTypeId: string
): Promise<IPackageDetails> => {
  try {
    const { data } = await api.get("/checkPackageDetails/" + packageTypeId, {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    return data;
  } catch (error) {
    console.log("Could not retrieve Bandwidth Data!", error);
    throw error;
  }
};

export const getHiveClients = async (): Promise<IClient[]> => {
  try {
    console.log(
      "front end accessing backend hive api /getprovisionedsubscribers"
    );
    const { data } = await api.get("/getprovisionedsubscribers", {
      params: {
        action: "api call - Active/Onhold Subscribers page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    }); //"/getHiveClients"
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

//==============================================================================================

//* LOGGER APIs *//

// POST: /log-frontend-action
export const addFrontendLogger = async (
  user: string,
  action: string,
  details: string,
  page: string,
  userAgent: string
) => {
  const { data } = await api.post("/log-frontend-action", {
    user: user,
    action: action,
    details: details,
    page: page,
    userAgent: userAgent,
  });

  console.log(
    "Sending frontend user action logs with '/log-frontend-action' api: ",
    data
  );
  return data;
};

//==============================================================================================

//* MISC APIs *//

// REVIEW: i think ACS auto provision api ni sya
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

// export const checkOltInterface = async (deviceName: string) => {
//   try {
//     const { data } = await api.get("/checkOltInterface/" + deviceName);
//     return data;
//   } catch (error) {
//     console.log("Could not retrieve Olt Interface Data!", error);
//     throw error;
//   }
// };

// REVIEW: redundant - UNUSED FUNCTION
export const getAllOlts = async (): Promise<IOlt[]> => {
  const { data } = await api.get("/getAllOlts", {
    params: {
      action: "api call from frontend",
      user: keycloak.tokenParsed?.preferred_username,
    },
  });
  return data;
};

// REVIEW: api currently not in hive backend - UNUSED FUNCTION
export const getOtcStatus = async (clientId: number) => {
  const { data } = await api.get("/getOtcStatus/" + clientId, {
    params: {
      action: "api call from frontend",
      user: keycloak.tokenParsed?.preferred_username,
    },
  });
  return data;
};

// REVIEW: api currently commented out in hive backend - UNUSED FUNCTION
export const getOneAvailableIpAddress = async () => {
  try {
    const { data } = await api.get("/getOneAvailableIpAddress", {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    return data;
  } catch (error) {
    console.log("Could not get One Available IpAddress Data!", error);
    throw error;
  }
};

// REVIEW: api currently not in hive backend
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

//==============================================================================================

//* TEST APIs *//

// POST: /simulateHiveMonitoringError
export const testError = async () => {
  const { data } = await api.post("/simulateHiveMonitoringError");
  return data;
};
