import { 
  Network, 
  GetAppIdParams, 
  SubmitTransactionParams, 
  SubmitForProcessingParams,
  GetTransactionStatusParams,
  SDKConfig, 
  TransactionResult, 
  BatchTransactionResult,
  TransactionStatus,
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
   * Submit transaction for batch processing
   * @param params - Parameters object
   * @param params.transactionHash - Transaction hash to submit for batch processing
   * @param params.network - Network to submit to ('testnet' or 'mainnet')
   * @param params.appId - Optional app ID (will be extracted from transaction if not provided)
   * @param params.userAddress - Optional user address (will be extracted from transaction if not provided)
   * @returns Promise<BatchTransactionResult> - Batch processing result
   * 
   * @example
   * ```typescript
   * const sdk = new CrossEraSDK();
   * const result = await sdk.submitForProcessing({
   *   transactionHash: '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468',
   *   network: 'mainnet'
   * });
   * console.log('Batch processing result:', result);
   * ```
   */
  async submitForProcessing(params: SubmitForProcessingParams): Promise<BatchTransactionResult> {
    const { transactionHash, network, appId, userAddress } = params;

    // Validate parameters
    validateTransactionHash(transactionHash);
    validateNetwork(network);

    try {
      const requestData: any = {
        transaction_hash: transactionHash,
      };

      // Add optional parameters if provided
      if (appId) {
        requestData.app_id = appId;
      }
      if (userAddress) {
        requestData.user_address = userAddress;
      }

      const response = await this.apiClient.submitForProcessing(network, requestData);

      return {
        ...response.data.data,
        network,
      };
    } catch (error: any) {
      // Handle 409 conflict gracefully - transaction already submitted
      if (error.status === 409 || error.message.includes('already submitted')) {
        // Return the conflict data if available
        if (error.response?.data?.data) {
          return {
            ...error.response.data.data,
            network,
          };
        }
        // Otherwise return a default response indicating it's already submitted
        return {
          success: false,
          transactionHash,
          appId: '',
          userAddress: '',
          status: 'pending' as const,
          submittedAt: new Date().toISOString(),
          estimatedProcessingTime: '24 hours',
          id: 0,
          network
        };
      }
      
      throw new Error(`Failed to submit transaction for batch processing ${transactionHash} on ${network}: ${error.message}`);
    }
  }

  /**
   * Get transaction processing status
   * @param params - Parameters object
   * @param params.transactionHash - Transaction hash to check status for
   * @param params.network - Network to check status on ('testnet' or 'mainnet')
   * @returns Promise<TransactionStatus> - Transaction processing status
   * 
   * @example
   * ```typescript
   * const sdk = new CrossEraSDK();
   * const status = await sdk.getTransactionStatus({
   *   transactionHash: '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468',
   *   network: 'mainnet'
   * });
   * console.log('Transaction status:', status);
   * ```
   */
  async getTransactionStatus(params: GetTransactionStatusParams): Promise<TransactionStatus> {
    const { transactionHash, network } = params;

    // Validate parameters
    validateTransactionHash(transactionHash);
    validateNetwork(network);

    try {
      const response = await this.apiClient.getTransactionStatus(network, transactionHash);

      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get transaction status ${transactionHash} on ${network}: ${error.message}`);
    }
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
  SubmitForProcessingParams,
  GetTransactionStatusParams,
  SDKConfig,
  TransactionResult,
  BatchTransactionResult,
  TransactionStatus,
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
