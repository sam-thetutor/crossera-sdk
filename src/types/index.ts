export type Network = 'testnet' | 'mainnet';

export interface GetAppIdParams {
  address: string;
  network: Network;
}

export interface SubmitTransactionParams {
  transactionHash: string;
  network: Network;
}

export interface SubmitForProcessingParams {
  transactionHash: string;
  network: Network;
  appId?: string; // Optional, will be extracted if not provided
  userAddress?: string; // Optional, will be extracted if not provided
}

export interface GetTransactionStatusParams {
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

export interface BatchTransactionResult {
  success: boolean;
  transactionHash: string;
  appId: string;
  userAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  submittedAt: string;
  estimatedProcessingTime: string;
  id: string; // Database ID (UUID)
  network: Network;
}

export interface TransactionStatus {
  transactionHash: string;
  appId: string;
  userAddress: string;
  network: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  submittedAt: string;
  processedAt?: string;
  processTxHash?: string; // On-chain process transaction hash
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  estimatedProcessingTime?: string; // For pending transactions
  batchInfo?: {
    id: string; // UUID
    startedAt: string;
    completedAt?: string;
    status: string;
  };
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
