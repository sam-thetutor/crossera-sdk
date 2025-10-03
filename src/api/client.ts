import axios, { AxiosInstance, AxiosError } from 'axios';
import { Network, NETWORK_CONFIGS } from '../types/network';

export class CrossEraAPIClient {
  private clients: Map<Network, AxiosInstance> = new Map();

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    Object.entries(NETWORK_CONFIGS).forEach(([network, config]) => {
      const client = axios.create({
        baseURL: config.baseUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Add response interceptor for error handling
      client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          const networkName = network as Network;
          const message = this.getErrorMessage(error, networkName);
          const enhancedError = new Error(message);
          (enhancedError as any).network = networkName;
          (enhancedError as any).status = error.response?.status;
          throw enhancedError;
        }
      );

      this.clients.set(network as Network, client);
    });
  }

  private getErrorMessage(error: AxiosError, network: Network): string {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      if (status === 404) {
        return `Resource not found on ${network}`;
      } else if (status === 400) {
        return data?.error || `Bad request to ${network}`;
      } else if (status === 500) {
        return `Internal server error on ${network}`;
      } else {
        return `Request failed with status ${status} on ${network}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      return `Network error: Unable to reach ${network}`;
    } else {
      // Something else happened
      return `Error: ${error.message}`;
    }
  }

  getClient(network: Network): AxiosInstance {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`No client found for network: ${network}`);
    }
    return client;
  }
}
