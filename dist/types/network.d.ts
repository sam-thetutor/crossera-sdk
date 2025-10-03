export type Network = 'testnet' | 'mainnet';
export interface NetworkConfig {
    baseUrl: string;
    chainId?: number;
    name: string;
}
export declare const NETWORK_CONFIGS: Record<Network, NetworkConfig>;
//# sourceMappingURL=network.d.ts.map