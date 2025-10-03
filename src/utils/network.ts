import { Network, NETWORK_CONFIGS } from '../types/network';
import { validateNetwork } from './validation';

export function getNetworkBaseUrl(network: Network): string {
  validateNetwork(network);
  return NETWORK_CONFIGS[network].baseUrl;
}

export function getAvailableNetworks(): Network[] {
  return Object.keys(NETWORK_CONFIGS) as Network[];
}

export function getNetworkConfig(network: Network) {
  validateNetwork(network);
  return NETWORK_CONFIGS[network];
}
