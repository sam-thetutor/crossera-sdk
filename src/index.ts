import { 
  Network, 
  GetAppIdParams, 
  SubmitTransactionParams, 
  SDKConfig, 
  TransactionResult, 
  NetworkConfig 
} from './types';
import { validateAddress, validateTransactionHash, validateNetwork } from './utils/validation';
import { getAvailableNetworks, getNetworkConfig } from './utils/network';
import { CrossEraAPIClient } from './api/client';

export class CrossEraSDK {
  private apiClient: CrossEraAPIClient;
  private defaultNetwork?: Network;

  constructor(config?: SDKConfig) {
    this.apiClient = new CrossEraAPIClient();
    this.defaultNetwork = config?.defaultNetwork;
  }

  /**
   * Get app ID by wallet address on specified network
   * @param params - Parameters object
   * @param params.address - Wallet address
   * @param params.network - Network to query ('testnet' or 'mainnet')
   * @returns Promise<string | null> - App ID or null if not found
   * 
   * @example
   * ```typescript
   * const sdk = new CrossEraSDK();
   * const appId = await sdk.getAppIdByAddress({
   *   address: '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF',
   *   network: 'testnet'
   * });
   * ```
   */
  async getAppIdByAddress(params: GetAppIdParams): Promise<string | null> {
    const { address, network } = params;

    // Validate parameters
    validateAddress(address);
    validateNetwork(network);

    try {
      const response = await this.apiClient.getClient(network).get(
        `/projects/register?owner=${address}`
      );

      // Extract app ID from the first project if any exist
      if (response.data?.success && response.data?.projects?.length > 0) {
        return response.data.projects[0].app_id || null;
      }
      return null;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(`Failed to get app ID for address ${address} on ${network}: ${error.message}`);
    }
  }

  /**
   * Submit transaction for rewards on specified network
   * @param params - Parameters object
   * @param params.transactionHash - Transaction hash to submit
   * @param params.network - Network to submit to ('testnet' or 'mainnet')
   * @returns Promise<TransactionResult> - Processing result
   * 
   * @example
   * ```typescript
   * const sdk = new CrossEraSDK();
   * const result = await sdk.submitTransaction({
   *   transactionHash: '0xede6251cb0667ac7a2b51bbb9308c5b244321fe4dbb9145e1a084e6bc84053de',
   *   network: 'testnet'
   * });
   * ```
   */
  async submitTransaction(params: SubmitTransactionParams): Promise<TransactionResult> {
    const { transactionHash, network } = params;

    // Validate parameters
    validateTransactionHash(transactionHash);
    validateNetwork(network);

    try {
      const response = await this.apiClient.getClient(network).post('/submit', {
        transaction_hash: transactionHash,
      });

      return {
        ...response.data.data,
        network,
      };
    } catch (error: any) {
      throw new Error(`Failed to submit transaction ${transactionHash} on ${network}: ${error.message}`);
    }
  }

  /**
   * Get network configuration
   * @param network - Network to get config for
   * @returns NetworkConfig - Network configuration
   * 
   * @example
   * ```typescript
   * const config = sdk.getNetworkConfig('testnet');
   * console.log(config.baseUrl); // 'https://crossera-testnet.vercel.app'
   * ```
   */
  getNetworkConfig(network: Network): NetworkConfig {
    validateNetwork(network);
    return getNetworkConfig(network);
  }

  /**
   * List available networks
   * @returns Network[] - Available networks
   * 
   * @example
   * ```typescript
   * const networks = sdk.getAvailableNetworks();
   * console.log(networks); // ['testnet', 'mainnet']
   * ```
   */
  getAvailableNetworks(): Network[] {
    return getAvailableNetworks();
  }
}

// Export types for external use
export type {
  Network,
  GetAppIdParams,
  SubmitTransactionParams,
  SDKConfig,
  TransactionResult,
  NetworkConfig,
  CampaignMetric,
  APIError,
} from './types';

// Export utilities
export { 
  validateAddress, 
  validateTransactionHash, 
  validateNetwork,
  isValidNetwork 
} from './utils/validation';

export { 
  getNetworkBaseUrl, 
  getAvailableNetworks, 
  getNetworkConfig 
} from './utils/network';

// Named export only (removed default export to avoid mixing warnings)
