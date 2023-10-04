import axios from 'axios'
import { IrowIpAddress } from 'src/components/models'

export const getIpAddresses = async (ipAddress: string): Promise<IrowIpAddress[]> => {
  try {
    if (ipAddress !== '') {
      const response = await axios({
        method: 'get',
        url: 'http://172.91.10.108:8080/getIpAddressesOfNetworkAddress/' + ipAddress

      })
      return response.data
    }
  } catch (err) {
    console.error(err)
  }
  return []
}
