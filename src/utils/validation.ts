import { Network } from '../types/network';

export function validateAddress(address: string): void {
  if (!address || typeof address !== 'string') {
    throw new Error('Address must be a non-empty string');
  }
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address format');
  }
}

export function validateTransactionHash(hash: string): void {
  if (!hash || typeof hash !== 'string') {
    throw new Error('Transaction hash must be a non-empty string');
  }
  
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
    throw new Error('Invalid transaction hash format');
  }
}

export function validateNetwork(network: string): asserts network is Network {
  if (!isValidNetwork(network)) {
    throw new Error(`Invalid network: ${network}. Must be 'testnet' or 'mainnet'`);
  }
}

export function isValidNetwork(network: string): network is Network {
  return network === 'testnet' || network === 'mainnet';
}
