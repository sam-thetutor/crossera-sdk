export type Network = 'testnet' | 'mainnet';

export interface NetworkConfig {
  baseUrl: string;
  chainId?: number;
  name: string;
}

export const NETWORK_CONFIGS: Record<Network, NetworkConfig> = {
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
