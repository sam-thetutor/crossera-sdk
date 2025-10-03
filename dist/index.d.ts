import { Network, GetAppIdParams, SubmitTransactionParams, SDKConfig, TransactionResult, NetworkConfig } from './types';
export declare class CrossEraSDK {
    private apiClient;
    private defaultNetwork?;
    constructor(config?: SDKConfig);
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
    getAppIdByAddress(params: GetAppIdParams): Promise<string | null>;
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
    submitTransaction(params: SubmitTransactionParams): Promise<TransactionResult>;
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
    getNetworkConfig(network: Network): NetworkConfig;
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
    getAvailableNetworks(): Network[];
}
export type { Network, GetAppIdParams, SubmitTransactionParams, SDKConfig, TransactionResult, NetworkConfig, CampaignMetric, APIError, } from './types';
export { validateAddress, validateTransactionHash, validateNetwork, isValidNetwork } from './utils/validation';
export { getNetworkBaseUrl, getAvailableNetworks, getNetworkConfig } from './utils/network';
//# sourceMappingURL=index.d.ts.map