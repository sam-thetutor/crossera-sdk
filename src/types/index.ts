export type Network = 'testnet' | 'mainnet';

export interface GetAppIdParams {
  address: string;
  network: Network;
}

export interface SubmitTransactionParams {
  transactionHash: string;
  network: Network;
}

export interface SDKConfig {
  defaultNetwork?: Network;
  timeout?: number;
  apiKey?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash: string;
  appId: string;
  processedAt: string;
  network: Network;
  metrics: {
    gasUsed: string;
    gasPrice: string;
    feeGenerated: string;
    transactionValue: string;
  };
  campaignsUpdated: number;
  campaignMetrics: CampaignMetric[];
}

export interface CampaignMetric {
  campaignId: number;
  totalFees: string;
  totalVolume: string;
  txCount: number;
  estimatedReward: string;
}

export interface NetworkConfig {
  baseUrl: string;
  chainId?: number;
  name: string;
}

export interface APIError {
  message: string;
  code?: string;
  network?: Network;
  status?: number;
}

// Re-export from network.ts
export { NETWORK_CONFIGS } from './network';
