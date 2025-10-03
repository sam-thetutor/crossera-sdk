export type Network = 'testnet' | 'mainnet';

export interface NetworkConfig {
  baseUrl: string;
  chainId?: number;
  name: string;
}

export const NETWORK_CONFIGS: Record<Network, NetworkConfig> = {
  testnet: {
    baseUrl: 'https://crossera.xyz/api',
    chainId: 4157,
    name: 'CrossFi Testnet'
  },
  mainnet: {
    baseUrl: 'https://crossera.xyz/api',
    chainId: 4158,
    name: 'CrossFi Mainnet'
  }
};
