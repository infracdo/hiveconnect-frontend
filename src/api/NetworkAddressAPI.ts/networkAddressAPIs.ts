import axios from 'axios';
import { IupdateClient, IexecuteProvision, IaddNewClient } from './types';
// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://172.91.10.108:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getIpAddresses = async (ipAddress: string | string[]) => {
  try {
    const response = await api.get(
      '/getIpAddressesOfNetworkAddress/' + ipAddress
    );
    return response.data;
  } catch (error) {
    console.log('Cannot retrieve IP Address data!', error);
    throw error;
  }
};

export const getNetworkAddresses = async () => {
  try {
    const response = await api.get('/getNetworkAddresses');
    return response.data;
  } catch (error) {
    console.log('Cannot Retrieve Network Address Data!', error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await api.get('/getClients');
    return response.data;
  } catch (error) {
    console.log('Could not retrieve Client/Subscriber Data!', error);
    throw error;
  }
};
export const getClientById = async (id: number) => {
  try {
    const response = await api.get('/getClientById/' + id);
    return response.data;
  } catch (error) {
    console.log('Could not retrieve Client/Subscriber Data!', error);
    throw error;
  }
};

export const updateClient = async (
  id: number,
  ipAddress: string,
  serialNum: string,
  olt: string,
  macaddress: string
) => {
  try {
    const response = await api.patch('/updateClient/' + id, {
      ipAddress: ipAddress,
      serialNumber: serialNum,
      olt: olt,
      macAddress: macaddress,
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not update Client/Subscriber Data!');
  }
};

export const executeProvision = async (
  accNum: string,
  clientName: string,
  serialNum: string,
  macaddress: string,
  ipAddress: string,
  olt: string,
  packageType: string
) => {
  try {
    const response = await api.post('/executeProvision', {
      accountNo: accNum,
      clientName: clientName,
      serialNumber: serialNum,
      macAddress: macaddress,
      ipAddress: ipAddress,
      olt: olt,
      packageType: packageType,
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not proceed execute provision!');
  }
};

export const addNewClient = async (
  accNum: string,
  packageType: string,
  serialNum: string,
  macAddress: string,
  oltIp: string,
  ipAssigned: string
) => {
  try {
    const response = await api.post('/addNewClient', {
      AccountID: accNum,
      OltIP: oltIp,
      ONUSerialNum: serialNum,
      PackageType: packageType,
      ONUMacAddress: macAddress,
      IPAssigned: ipAssigned,
    });
    return response.data;
  } catch (error) {
    console.log('Could not add New Client!', error);
    throw error;
  }
};

export const getOneAvailableIpAddress = async () => {
  try {
    const response = await api.get('/getOneAvailableIpAddress');
    return response.data;
  } catch (error) {
    console.log('Could not retrieve Client/Subscriber Data!', error);
    throw error;
  }
};
