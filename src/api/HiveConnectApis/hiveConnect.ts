import axios, { isAxiosError } from "axios";
import { AxiosError } from "axios";
import { useDevicesStore } from "src/stores/rogue-device/rogue-devices";
import { useNetworkStore } from "src/stores/network-address/network-address";
import {
  ISubscribers,
  IRogueDevices,
  IipAddressesOfCidrBlock,
  IOltSites,
  IPackageDetails,
  INetworkAddresses,
} from "./types";
import { keycloak } from "src/boot/keycloak";
// import { auth } from "src/stores/auth";
const deviceStore = useDevicesStore();
const networkStore = useNetworkStore();
// const kc = auth();

const API_BASE_URL = process.env.PROVISION_API_URL;
const JWT_TOKEN = import.meta.env.VITE_PROVISION_BEARER_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 0,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${JWT_TOKEN}`;
    return config;
  },
  (error) => {
    console.error("Error in API configuration for headers: ", error);
    return Promise.reject(error);
  }
);

//==============================================================================================

//* AUTO PROVISION APIs *//

// POST: /preprovisionCheck
// PURPOSE: Sends required payload to backend for pre-checking in provisioning
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
  try {
    console.log("Calling '/preprovisionCheck' API endpoint...");
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
    console.log(
      "Returned data by calling '/preprovisionCheck' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling the '/preprovisionCheck' API endpoint: ",
      error
    );
    throw error;
  }
};

// POST: /executeAutoConfig
// PURPOSE: Sends required payload to backend to provision the selected subscriber
export const executeAutoConfig = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  olt: string,
  packageType: string,
  newOltId: number,
  location: string
  // downstream: number,
  // upstream: number
) => {
  try {
    console.log("Calling '/executeAutoConfig' API endpoint...");
    const { data } = await api.post("/executeAutoConfig", {
      accountNo: accNum,
      clientName: clientName,
      serialNumber: serialNum,
      macAddress: macaddress,
      olt: olt,
      packageType: packageType,
      oltId: newOltId,
      location: location,
      // downstream: downstream, //added
      // upstream: upstream, //added
    });
    console.log(
      "Returned data by calling '/executeAutoConfig' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling the '/executeAutoConfig' API endpoint: ",
      error
    );
    throw error;
  }
};

// POST: /executeMonitoring
// PURPOSE: Sends required payload to the backend to execute the monitoring process
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
  try {
    console.log("Calling '/executeMonitoring' API endpoint...");
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
    console.log(
      "Returned data by calling '/executeMonitoring' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling the '/executeMonitoring' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* SUBSCRIBER APIs *//

//<-------------------------- HIVE/FOR PROVISION ------------------------------------->
// GET: /getsubscribers
// PURPOSE: Fetches subscribers from new_subscriber table where status is 'NEW'
export const getNewSubscribers = async (): Promise<ISubscribers[]> => {
  try {
    console.log("Calling '/getsubscribers' API endpoint...");
    const { data } = await api.get("/getsubscribers", {
      params: {
        action: "api call - Subscribers for Provisioning page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getsubscribers' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getsubscribers' API endpoint: ",
      error
    );
    throw error;
  }
};

// GET: /getprovisionedsubscribers
// PURPOSE: Fetches provisioned subscribers from hive_clients table which the status is either 'ACTIVE' or 'ONHOLD'
export const getHiveSubscribers = async (): Promise<ISubscribers[]> => {
  try {
    console.log("Calling '/getprovisionedsubscribers' API endpoint...");
    const { data } = await api.get("/getprovisionedsubscribers", {
      params: {
        action: "api call - Active/Onhold Subscribers page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getprovisionedsubscribers' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.log(
      "Error while calling '/getprovisionedsubscribers' API endpoint: ",
      error
    );
    throw error;
  }
};

// GET: /getHiveClients
// PURPOSE: Fetches provisioned subscribers from hive_clients table with status 'ACTIVE'
export const getHiveActiveSubscribers = async (): Promise<ISubscribers[]> => {
  try {
    console.log("Calling '/getHiveClients' API endpoint...");
    const { data } = await api.get("/getHiveClients", {
      params: {
        action: "api call - Troubleshoot page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getHiveClients' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getHiveClients' API endpoint: ",
      error
    );
    throw error;
  }
};

// GET: /getsubscriberbyid/{id}
// PURPOSE: Fetches subscriber by ID from new_subscriber table
export const getSubscriberById = async (
  newsubscriberId: number
): Promise<ISubscribers> => {
  try {
    console.log("Calling '/getsubscriberbyid/{id}' API endpoint...");
    const { data } = await api.get("/getsubscriberbyid/" + newsubscriberId, {
      params: {
        action: "api call - Provision Subscriber modal",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getsubscriberbyid/{id}' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getsubscriberbyid/{id}' API endpoint: ",
      error
    );
    throw error;
  }
};

// GET: /getHiveClientById/{id}
// PURPOSE: Fetches subscriber by ID in hive_clients table
export const getHiveClientById = async (id: number): Promise<ISubscribers> => {
  try {
    console.log("Calling '/getHiveClientById/{id}' API endpoint...");
    const { data } = await api.get("/getHiveClientById/" + id, {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getHiveClientById/{id}' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getHiveClientById/{id}' API endpoint: ",
      error
    );
    throw error;
  }
};

//<-------------------------- FOR MIGRATION ------------------------------------->

// GET: /getmigratingsubscribers
// PURPOSE: Fetches subscribers that are for migration from hive_clients table with status that has '_PENDING_MIGRATION'
export const getSubscribersForMigration = async () => {
  try {
    console.log("Calling '/getmigratingsubscribers' API endpoint...");
    const { data } = await api.get("/getmigratingsubscribers", {
      params: {
        action: "api call - Subscribers for Migration page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getmigratingsubscribers' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getmigratingsubscribers' API endpoint: ",
      error
    );
    throw error;
  }
};

// POST: /updateMigrationSubscriberStatus
// PURPOSE: Updates subscriber for migration status by removing the '_PENDING_MIGRATION' then informs ABS of the status change and updates the hive_clients table
export const updateSubscriberForMigrationStatus = async (accountNo: string) => {
  try {
    console.log("Calling '/updateMigrationSubscriberStatus' API endpoint...");
    const { data } = await api.post("/updateMigrationSubscriberStatus", {
      subscriberAccountNumber: accountNo,
    });
    console.log(
      "Returned data by calling '/updateMigrationSubscriberStatus' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/updateMigrationSubscriberStatus' API endpoint: ",
      error
    );

    if (isAxiosError(error) && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    } else {
      throw error;
    }
  }
};

// POST: /executeMigration
// PURPOSE: Migrates the subscriber from bucket to Hive
export const migrateSubscriberFromBucketToHive = async (accountNo: string) => {
  try {
    console.log("Calling '/executeMigration' API endpoint...");
    const { data } = await api.post("/executeMigration", {
      accountNo: accountNo,
    });
    console.log(
      "Returned data by calling '/executeMigration' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/executeMigration' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* OLT APIs *//

// GET: /getallolt
// PURPOSE: Fetches all OLT sites from site_olt table
export const getOltSites = async (): Promise<IOltSites[]> => {
  try {
    console.log("Calling '/getallolt' API endpoint...");
    const { data } = await api.get("/getallolt", {
      params: {
        action: "api call - Subscribers for Provisioning page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log("Returned data by calling '/getallolt' API endpoint: ", data);
    return data;
  } catch (error) {
    console.error("Error while calling '/getallolt' API endpoint: ", error);
    throw error;
  }
};

// GET: /getOltByIp/{oltIp}
// PURPOSE: Fetches OLT site by IP address from site_olt table
export const checkOltSiteByIp = async (oltIp: string): Promise<IOltSites> => {
  try {
    console.log("Calling '/getOltByIp/{oltIp}' API endpoint...");
    const { data } = await api.get("/checkOltSiteByIp/" + oltIp, {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getOltByIp/{oltIp}' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getOltByIp/{oltIp}' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* ACS APIs *//

// GET: /getRogueDevices
// PURPOSE: Fetches ONU devices from device table where the parent is "unassigned" (rogue)
export const getRogueDevices = async (): Promise<IRogueDevices[]> => {
  try {
    console.log("Calling '/getRogueDevices' API endpoint...");
    const { data } = await api.get("/getRogueDevices", {
      params: {
        action: "api call - Rogue Devices page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    // TODO: Study what is this for
    deviceStore.$patch({
      rogueDevice: data,
    });
    console.log(
      "Returned data by calling '/getRogueDevices' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getRogueDevices' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* DHCP APIs *//

// GET: /getIpAddressesOfCidrBlock/{cidrBlock}
// PURPOSE: Fetches IP addresses per network to populate Addresses details page table
// TODO: review this!! kay ang gina expect sa backend kay cidrBlock unya ang gi send na parameter kay ip address???
export const getIpAddresses = async (
  ipAddress: string | string[]
): Promise<IipAddressesOfCidrBlock[]> => {
  try {
    console.log(
      "Calling '/getIpAddressesOfCidrBlock/{cidrBlock}' API endpoint..." +
        ipAddress
    );
    const { data } = await api.get("/getIpAddressesOfCidrBlock/" + ipAddress, {
      params: {
        action: "api call - Network IP Addresses page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/getIpAddressesOfCidrBlock/{cidrBlock}' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getIpAddressesOfCidrBlock/{cidrBlock}' API endpoint: ",
      error
    );
    throw error;
  }
};

// GET: /getallnetworks
// PURPOSE: Fetches all CIDR blocks from cidr_block table to populate Addresses page table
export const getNetworkAddresses = async (): Promise<INetworkAddresses[]> => {
  try {
    console.log("Calling '/getallnetworks' API endpoint...");
    const { data } = await api.get("/getallnetworks", {
      params: {
        action: "api call - Addresses page",
        user: keycloak.tokenParsed?.preferred_username,
      },
    }); ///getCidrBlocks // TODO: REVIEW THIS!!
    networkStore.$patch({
      networkAddressDetail: data,
    });
    console.log(
      "Returned data by calling '/getallnetworks' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/getallnetworks' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* PACKAGE TYPE APIs *//

// GET: /checkPackageDetails/{packageType}
// PURPOSE: Fetches package details from new_packages table for Active/Onhold Subscribers details page
// TODO: correct the parameter! nganong package type id may nakabutang ani kung ang gina expect sa backend kay package type lng mismo
export const checkPackageDetails = async (
  packageTypeId: string
): Promise<IPackageDetails> => {
  try {
    console.log("Calling '/checkPackageDetails/{packageType}' API endpoint...");
    const { data } = await api.get("/checkPackageDetails/" + packageTypeId, {
      params: {
        action: "api call from frontend",
        user: keycloak.tokenParsed?.preferred_username,
      },
    });
    console.log(
      "Returned data by calling '/checkPackageDetails/{packageType}' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/checkPackageDetails/{packageType}' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* LOGGER APIs *//

// POST: /log-frontend-action
// PURPOSE: Sends user action logs from frontend to backend (for writing log files as .log)
export const addFrontendLogger = async (
  user: string,
  action: string,
  details: string,
  page: string,
  userAgent: string
) => {
  try {
    console.log("Calling '/log-frontend-action' API endpoint...");
    const { data } = await api.post("/log-frontend-action", {
      user: user,
      action: action,
      details: details,
      page: page,
      userAgent: userAgent,
    });
    console.log(
      "Returned data by calling '/log-frontend-action' API endpoint: ",
      data
    );
    return data;
  } catch (error) {
    console.error(
      "Error while calling '/addFrontendLogger' API endpoint: ",
      error
    );
    throw error;
  }
};

//==============================================================================================

//* MISC APIs *//

// POST: /executeProvision
// PURPOSE: Send required payload for provisioning through INET
// NOTE: i think INET auto provision api ni sya (not used anywhere here sa frontend; commented in case gamiton pa in the future, but remove this if 100% dli na gamiton for cleaner code)
// export const executeProvision = async (
//   accNum: string,
//   clientName: string,
//   serialNum: string,
//   macaddress: string,
//   newOltId: number,
//   olt: string,
//   packageType: string
//   // downstream: number, //added
//   // upstream: number, //added
// ) => {
//   try {
//     console.log("Calling '/executeProvision' API endpoint...");
//     const { data } = await api.post("/executeProvision", {
//       accountNo: accNum,
//       clientName: clientName,
//       serialNumber: serialNum,
//       macAddress: macaddress,
//       olt: olt,
//       oltId: newOltId,
//       packageType: packageType,
//       // downstream: downstream, //added
//       // upstream: upstream, //added
//     });
//     console.log(
//       "Returned data by calling '/executeProvision' API endpoint: ",
//       data
//     );
//     return data;
//   } catch (error) {
//     console.error(
//       "Error while calling '/executeProvision' API endpoint: ",
//       error
//     );
//     throw error;
//   }
// };

// NOTE: api currently not in hive backend pero weird kaayo kay gigamit sa prev devs para sa TroubleshootClient.vue (Active/Onhold Subscribers Details Page); commented instead since naka save ang function sa dist directory and if i remove nako, basin magka deployment issues
// export const getOtcStatus = async (clientId: number) => {
//   const { data } = await api.get("/getOtcStatus/" + clientId, {
//     params: {
//       action: "api call from frontend",
//       user: keycloak.tokenParsed?.preferred_username,
//     },
//   });
//   return data;
// };

//==============================================================================================

//* TEST APIs *//

// POST: /simulateHiveMonitoringError
// NOTE: Not used anywhere here in frontend
// export const testError = async () => {
//   const { data } = await api.post("/simulateHiveMonitoringError");
//   return data;
// };
