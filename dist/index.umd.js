(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios')) :
    typeof define === 'function' && define.amd ? define(['exports', 'axios'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CrossEraSDK = {}, global.axios));
})(this, (function (exports, axios) { 'use strict';

    function validateAddress(address) {
        if (!address || typeof address !== 'string') {
            throw new Error('Address must be a non-empty string');
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            throw new Error('Invalid Ethereum address format');
        }
    }
    function validateTransactionHash(hash) {
        if (!hash || typeof hash !== 'string') {
            throw new Error('Transaction hash must be a non-empty string');
        }
        if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
            throw new Error('Invalid transaction hash format');
        }
    }
    function validateNetwork(network) {
        if (!isValidNetwork(network)) {
            throw new Error(`Invalid network: ${network}. Must be 'testnet' or 'mainnet'`);
        }
    }
    function isValidNetwork(network) {
        return network === 'testnet' || network === 'mainnet';
    }

    const NETWORK_CONFIGS = {
        testnet: {
            baseUrl: 'https://crossera-testnet.vercel.app',
            chainId: 1144,
            name: 'CrossFi Testnet'
        },
        mainnet: {
            baseUrl: 'https://crossera.vercel.app',
            chainId: 1144,
            name: 'CrossFi Mainnet'
        }
    };

    function getNetworkBaseUrl(network) {
        validateNetwork(network);
        return NETWORK_CONFIGS[network].baseUrl;
    }
    function getAvailableNetworks() {
        return Object.keys(NETWORK_CONFIGS);
    }
    function getNetworkConfig(network) {
        validateNetwork(network);
        return NETWORK_CONFIGS[network];
    }

    class CrossEraAPIClient {
        constructor() {
            this.clients = new Map();
            this.initializeClients();
        }
        initializeClients() {
            Object.entries(NETWORK_CONFIGS).forEach(([network, config]) => {
                const client = axios.create({
                    baseURL: config.baseUrl,
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // Add response interceptor for error handling
                client.interceptors.response.use((response) => response, (error) => {
                    const networkName = network;
                    const message = this.getErrorMessage(error, networkName);
                    const enhancedError = new Error(message);
                    enhancedError.network = networkName;
                    enhancedError.status = error.response?.status;
                    throw enhancedError;
                });
                this.clients.set(network, client);
            });
        }
        getErrorMessage(error, network) {
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const data = error.response.data;
                if (status === 404) {
                    return `Resource not found on ${network}`;
                }
                else if (status === 400) {
                    return data?.error || `Bad request to ${network}`;
                }
                else if (status === 500) {
                    return `Internal server error on ${network}`;
                }
                else {
                    return `Request failed with status ${status} on ${network}`;
                }
            }
            else if (error.request) {
                // Request was made but no response received
                return `Network error: Unable to reach ${network}`;
            }
            else {
                // Something else happened
                return `Error: ${error.message}`;
            }
        }
        getClient(network) {
            const client = this.clients.get(network);
            if (!client) {
                throw new Error(`No client found for network: ${network}`);
            }
            return client;
        }
    }

    class CrossEraSDK {
        constructor(config) {
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
        async getAppIdByAddress(params) {
            const { address, network } = params;
            // Validate parameters
            validateAddress(address);
            validateNetwork(network);
            try {
                const response = await this.apiClient.getClient(network).get(`/api/projects/address/${address}`);
                return response.data.appId || null;
            }
            catch (error) {
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
        async submitTransaction(params) {
            const { transactionHash, network } = params;
            // Validate parameters
            validateTransactionHash(transactionHash);
            validateNetwork(network);
            try {
                const response = await this.apiClient.getClient(network).post('/api/submit', {
                    transaction_hash: transactionHash,
                });
                return {
                    ...response.data.data,
                    network,
                };
            }
            catch (error) {
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
        getNetworkConfig(network) {
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
        getAvailableNetworks() {
            return getAvailableNetworks();
        }
    }
    // Named export only (removed default export to avoid mixing warnings)

    exports.CrossEraSDK = CrossEraSDK;
    exports.getAvailableNetworks = getAvailableNetworks;
    exports.getNetworkBaseUrl = getNetworkBaseUrl;
    exports.getNetworkConfig = getNetworkConfig;
    exports.isValidNetwork = isValidNetwork;
    exports.validateAddress = validateAddress;
    exports.validateNetwork = validateNetwork;
    exports.validateTransactionHash = validateTransactionHash;

}));
//# sourceMappingURL=index.umd.js.map
