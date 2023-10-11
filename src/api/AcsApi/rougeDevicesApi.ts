import axios from 'axios';
import { useDevicesStore } from '../../stores/rogue-device/rogue-devices';

const store = useDevicesStore();

export const getDevices = async () => {
  try {
    const response = await axios.get(
      'http://172.91.0.136:7547/getRogueDevices'
    );
    store.$patch({
      rogueDevice: response.data,
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not retrieve data!');
  }
};
