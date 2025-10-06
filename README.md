# CrossEra SDK

Official SDK for CrossEra - CrossFi Reward System. This SDK provides easy access to CrossEra's reward system functionality with **efficient batch processing** as the primary method for transaction submission.

## Installation

```bash
npm install @crossera/sdk
```

## Quick Start

```typescript
import { CrossEraSDK } from '@crossera/sdk';

const sdk = new CrossEraSDK();

// Get app ID by address
const appId = await sdk.getAppIdByAddress({
  address: '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF',
  network: 'testnet'
});

// Submit transaction for batch processing (recommended)
const result = await sdk.submitForProcessing({
  transactionHash: '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468',
  network: 'mainnet'
});

console.log('Queued for processing:', result);
// {
//   success: true,
//   status: 'pending',
//   estimatedProcessingTime: '~14 hours (next batch runs at 00:00 UTC)'
// }

// Check status later
const status = await sdk.getTransactionStatus({
  transactionHash: '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468',
  network: 'mainnet'
});
```

## API Reference

### CrossEraSDK

#### Constructor

```typescript
new CrossEraSDK(config?: SDKConfig)
```

**Parameters:**
- `config` (optional): SDK configuration object
  - `defaultNetwork?: Network` - Default network to use
  - `timeout?: number` - Request timeout in milliseconds
  - `apiKey?: string` - API key for authentication (future use)

#### Methods

##### getAppIdByAddress

Get app ID by wallet address on specified network.

```typescript
async getAppIdByAddress(params: GetAppIdParams): Promise<string | null>
```

**Parameters:**
- `params.address` - Wallet address (0x format)
- `params.network` - Network to query ('testnet' or 'mainnet')

**Returns:** App ID string or null if not found

**Example:**
```typescript
const appId = await sdk.getAppIdByAddress({
  address: '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF',
  network: 'testnet'
});
```

##### submitForProcessing (Primary Method)

Submit transaction for **batch processing** (processed daily at 00:00 UTC). This is the **recommended method** for most use cases.

```typescript
async submitForProcessing(params: SubmitForProcessingParams): Promise<BatchTransactionResult>
```

**Parameters:**
- `params.transactionHash` - Transaction hash (0x format)
- `params.network` - Network to submit to ('testnet' or 'mainnet')
- `params.appId` - (Optional) App ID - will be extracted from transaction if not provided
- `params.userAddress` - (Optional) User address - will be extracted from transaction if not provided

**Returns:** Batch transaction result with pending status

**Example:**
```typescript
const sdk = new CrossEraSDK();

// Submit for batch processing
const result = await sdk.submitForProcessing({
  transactionHash: '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468',
  network: 'mainnet',
  appId: 'my-app-id',        // Optional
  userAddress: '0x...'       // Optional
});

console.log('Submitted!');
console.log('Status:', result.status);                    // 'pending'
console.log('Estimated time:', result.estimatedProcessingTime); // '~14 hours'
console.log('ID:', result.id);                           // UUID for tracking
```

**Response:**
```typescript
{
  success: true,
  transactionHash: '0x...',
  appId: 'my-app-id',
  userAddress: '0x...',
  network: 'mainnet',
  status: 'pending',
  submittedAt: '2025-10-06T10:30:00Z',
  estimatedProcessingTime: '~14 hours (next batch runs at 00:00 UTC)',
  id: '76d2d5b4-85c2-4ca0-8a9c-cc4f8190baac'
}
```

##### submitTransaction (Legacy/Immediate Processing)

Submit transaction for **immediate** rewards processing on specified network. 

> ⚠️ **Note:** This method processes transactions immediately but is less efficient than batch processing. Use `submitForProcessing()` for better performance and cost-effectiveness.

```typescript
async submitTransaction(params: SubmitTransactionParams): Promise<TransactionResult>
```

**Parameters:**
- `params.transactionHash` - Transaction hash (0x format)
- `params.network` - Network to submit to ('testnet' or 'mainnet')

**Returns:** Transaction processing result

**Example:**
```typescript
const result = await sdk.submitTransaction({
  transactionHash: '0xede6251cb0667ac7a2b51bbb9308c5b244321fe4dbb9145e1a084e6bc84053de',
  network: 'testnet'
});
```

##### getTransactionStatus

Get the processing status of a batch-submitted transaction.

```typescript
async getTransactionStatus(params: GetTransactionStatusParams): Promise<TransactionStatus>
```

**Parameters:**
- `params.transactionHash` - Transaction hash to check
- `params.network` - Network where transaction was submitted

**Returns:** Transaction status with complete details

**Example:**
```typescript
const status = await sdk.getTransactionStatus({
  transactionHash: '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468',
  network: 'mainnet'
});

console.log('Status:', status.status);           // 'completed'
console.log('Process TX:', status.processTxHash); // On-chain proof
console.log('Retry count:', status.retryCount);  // 0

if (status.batchInfo) {
  console.log('Batch ID:', status.batchInfo.id);
  console.log('Batch started:', status.batchInfo.startedAt);
}
```

**Response (Pending):**
```typescript
{
  transactionHash: '0x...',
  appId: 'my-app-id',
  userAddress: '0x...',
  network: 'mainnet',
  status: 'pending',
  submittedAt: '2025-10-06T10:30:00Z',
  processedAt: null,
  processTxHash: null,
  retryCount: 0,
  maxRetries: 3,
  estimatedProcessingTime: '~14 hours',
  errorMessage: null,
  batchInfo: null
}
```

**Response (Completed):**
```typescript
{
  transactionHash: '0x...',
  appId: 'my-app-id',
  userAddress: '0x...',
  network: 'mainnet',
  status: 'completed',
  submittedAt: '2025-10-06T10:30:00Z',
  processedAt: '2025-10-07T00:05:23Z',
  processTxHash: '0xabc123...',  // On-chain proof
  retryCount: 0,
  maxRetries: 3,
  estimatedProcessingTime: null,
  errorMessage: null,
  batchInfo: {
    id: '82df2a09-3a01-4786-a679-c96458658ae1',
    startedAt: '2025-10-07T00:00:00Z',
    completedAt: '2025-10-07T00:30:00Z',
    status: 'completed'
  }
}
```

##### getNetworkConfig

Get network configuration.

```typescript
getNetworkConfig(network: Network): NetworkConfig
```

**Parameters:**
- `network` - Network to get config for

**Returns:** Network configuration object

##### getAvailableNetworks

List available networks.

```typescript
getAvailableNetworks(): Network[]
```

**Returns:** Array of available networks

---

## 🔄 How Batch Processing Works

### Overview

Batch processing allows you to submit transactions efficiently. Instead of processing immediately (which requires gas for each call), transactions are queued and processed together once daily at **00:00 UTC**.

### Complete Flow

#### **1. User Submits Transaction**

```typescript
const sdk = new CrossEraSDK();

const result = await sdk.submitForProcessing({
  transactionHash: '0x83d90d1d08627aacf6e0bf48175bbd810af74fdb4a4e3d39c356229a9e202827',
  network: 'mainnet'
});

console.log('Submitted!', result);
// {
//   success: true,
//   status: 'pending',
//   estimatedProcessingTime: '~14 hours (next batch runs at 00:00 UTC)',
//   id: '6735815f-9d0b-4b59-b129-a071f913c50b'
// }
```

**What Happens**:
- SDK validates the transaction hash format
- Makes HTTP POST to `/api/sdk/submit`
- API validates transaction on blockchain
- Extracts `app_id` from transaction data
- Verifies app is registered on-chain
- Stores in database queue with status `'pending'`
- Returns confirmation with estimated time

#### **2. Transaction Waits in Queue**

Your transaction sits in the database with:
- Status: `'pending'`
- Network: `'mainnet'`
- Estimated processing: Next midnight UTC

You can check status anytime:

```typescript
const status = await sdk.getTransactionStatus({
  transactionHash: '0x83d90d1d...',
  network: 'mainnet'
});

console.log('Current status:', status.status);  // 'pending'
console.log('Estimated time:', status.estimatedProcessingTime);  // '~12 hours'
```

#### **3. Batch Processor Runs Daily**

At **00:00 UTC every day**, the batch processor:

**Step A: Fetches Pending Transactions**
```javascript
// Finds all transactions with status='pending'
// Groups by network (mainnet/testnet)
// Processes in batches of 50
```

**Step B: For Each Transaction:**

1. **Get Details from Blockchain**
   ```javascript
   const tx = await provider.getTransaction(hash);
   const receipt = await provider.getTransactionReceipt(hash);
   ```

2. **Verify App Registration**
   ```javascript
   const isRegistered = await contract.registeredApps(appId);
   const campaigns = await contract.getAppRegisteredCampaigns(appId);
   ```

3. **Calculate Metrics**
   ```javascript
   const gasUsed = receipt.gasUsed;           // 29115
   const gasPrice = tx.gasPrice;              // 562500000000
   const feeGenerated = gasUsed * gasPrice;   // Total fee in wei
   ```

4. **Track Unique User** 👥
   ```javascript
   // Check if this is a new unique user for the project
   if (isNewUser) {
     insert_new_unique_user(...);  // Adds to project_unique_users
   } else {
     update_existing_user_stats(...);  // Updates existing user
   }
   ```

5. **Process On-Chain for Rewards** ⛓️
   ```javascript
   // Calls the smart contract with verifier wallet
   const processTx = await contract.processTransaction(
     appId,
     txHash,
     gasUsed,
     gasPrice,
     transactionValue
   );
   
   // Smart contract:
   // - Marks transaction as processed
   // - Updates campaign metrics (fees, volume, tx count)
   // - Calculates rewards (10% of gas fees)
   // - Emits TransactionProcessed event
   
   const receipt = await processTx.wait();
   // Gets: process_tx_hash (on-chain proof)
   ```

6. **Save to Database** 💾
   ```javascript
   // Inserts into transactions table
   await supabase.from('transactions').insert({
     tx_hash: txHash,
     app_id: appId,
     campaign_id: campaignId,
     gas_used: gasUsed.toString(),
     gas_price: gasPrice.toString(),
     fee_generated: feeGenerated.toString(),
     process_tx_hash: receipt.hash,  // On-chain proof
     is_unique_user: isNewUser,
     reward_calculated: estimatedReward.toString()
   });
   ```

7. **Update Campaign Metrics & Leaderboard** 📊
   ```javascript
   // Fetch updated metrics from smart contract
   const metrics = await contract.getAppCampaignMetrics(appId, campaignId);
   
   // Update database (leaderboard data)
   await supabase.from('campaigns').update({
     total_transactions: metrics.txCount  // Leaderboard updated!
   });
   ```

8. **Mark as Completed** ✅
   ```javascript
   await supabase.from('sdk_pending_transactions').update({
     status: 'completed',
     processed_at: NOW(),
     process_tx_hash: receipt.hash,
     batch_id: batchId
   });
   ```

#### **4. User Verifies Completion**

```typescript
// Check status after batch runs
const status = await sdk.getTransactionStatus({
  transactionHash: '0x83d90d1d...',
  network: 'mainnet'
});

console.log(status);
// {
//   status: 'completed',
//   processedAt: '2025-10-07T00:05:23Z',
//   processTxHash: '0x57892fd...',  // On-chain proof!
//   batchInfo: {
//     id: '82df2a09-...',
//     startedAt: '2025-10-07T00:00:00Z',
//     completedAt: '2025-10-07T00:30:00Z',
//     status: 'completed'
//   }
// }
```

---

### Benefits of Batch Processing

1. **Efficient** ⚡
   - Processes thousands of transactions together
   - Lower overhead than individual API calls
   - Optimized database operations

2. **Cost-Effective** 💰
   - Single gas cost for batch processing
   - No per-transaction API fees
   - Reduced server load

3. **Reliable** 🛡️
   - Automatic retry logic (3 attempts)
   - Complete audit trail
   - Status tracking at every step

4. **Scalable** 📈
   - Can handle high transaction volumes
   - Batch size: 50 transactions
   - Can process 10,000+ txs per day

### When to Use Batch Processing

**Use `submitForProcessing()` when:**
- ✅ Processing delay is acceptable (up to 24 hours)
- ✅ Submitting many transactions
- ✅ Building integrations or analytics tools
- ✅ Cost efficiency is important

**Use `submitTransaction()` when:**
- ✅ Need immediate processing
- ✅ Real-time rewards are critical
- ✅ Interactive user experience required

---

### Batch Processing Timeline

```
User submits at 10:00 UTC
        ↓
Queued instantly (status: 'pending')
        ↓
Estimated: ~14 hours
        ↓
Batch runs at 00:00 UTC next day
        ↓
Processed in ~2-5 minutes
        ↓
Status: 'completed' with proof
```

### Database Tables Involved

During batch processing, these tables are updated:

1. **sdk_pending_transactions** - Queue and status tracking
2. **transactions** - Complete transaction records
3. **project_unique_users** - Per-user metrics
4. **project_user_stats** - Aggregate project statistics
5. **campaigns** - Campaign metrics and leaderboard data
6. **sdk_batch_runs** - Batch execution history

### Monitoring Your Submissions

```typescript
// Poll for status every minute
const interval = setInterval(async () => {
  const status = await sdk.getTransactionStatus({
    transactionHash: '0x83d90d1d...',
    network: 'mainnet'
  });
  
  console.log('Status:', status.status);
  
  if (status.status === 'completed') {
    console.log('✅ Processing complete!');
    console.log('🔗 On-chain proof:', status.processTxHash);
    clearInterval(interval);
  } else if (status.status === 'failed') {
    console.error('❌ Processing failed:', status.errorMessage);
    console.log('🔄 Retry count:', status.retryCount, '/', status.maxRetries);
    clearInterval(interval);
  }
}, 60000);
```

---

## Types

### Network

```typescript
type Network = 'testnet' | 'mainnet';
```

### GetAppIdParams

```typescript
interface GetAppIdParams {
  address: string;
  network: Network;
}
```

### SubmitTransactionParams

```typescript
interface SubmitTransactionParams {
  transactionHash: string;
  network: Network;
}
```

### TransactionResult

```typescript
interface TransactionResult {
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
```

## Usage Examples

### React Hook

```typescript
import { CrossEraSDK, Network } from '@crossera/sdk';
import { useCallback, useMemo } from 'react';

function useCrossEra(network: Network) {
  const sdk = useMemo(() => new CrossEraSDK(), []);
  
  const getAppId = useCallback(async (address: string) => {
    try {
      return await sdk.getAppIdByAddress({ address, network });
    } catch (error) {
      console.error(`Failed to get app ID on ${network}:`, error);
      return null;
    }
  }, [sdk, network]);
  
  const submitTransaction = useCallback(async (hash: string) => {
    try {
      return await sdk.submitTransaction({ transactionHash: hash, network });
    } catch (error) {
      console.error(`Failed to submit transaction on ${network}:`, error);
      throw error;
    }
  }, [sdk, network]);
  
  return { getAppId, submitTransaction };
}
```

### Error Handling

```typescript
import { CrossEraSDK } from '@crossera/sdk';

const sdk = new CrossEraSDK();

async function handleAppIdLookup(address: string, network: Network) {
  try {
    const appId = await sdk.getAppIdByAddress({ address, network });
    
    if (appId) {
      console.log(`App ID found on ${network}:`, appId);
    } else {
      console.log(`No app ID found for address ${address} on ${network}`);
    }
    
    return appId;
  } catch (error) {
    console.error(`Error looking up app ID on ${network}:`, error.message);
    throw error;
  }
}
```

### Batch Operations

```typescript
import { CrossEraSDK } from '@crossera/sdk';

const sdk = new CrossEraSDK();

async function batchGetAppIds(addresses: string[], network: Network) {
  const results = await Promise.allSettled(
    addresses.map(address => 
      sdk.getAppIdByAddress({ address, network })
    )
  );
  
  return results.map((result, index) => ({
    address: addresses[index],
    appId: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
}
```

## Network Configuration

### Testnet
- **Base URL:** `https://crossera-testnet.vercel.app`
- **Chain ID:** 1144
- **Name:** CrossFi Testnet

### Mainnet
- **Base URL:** `https://crossera.vercel.app`
- **Chain ID:** 1144
- **Name:** CrossFi Mainnet

## Error Handling

The SDK provides comprehensive error handling:

- **Validation Errors:** Invalid address, transaction hash, or network
- **Network Errors:** Connection issues or server errors
- **API Errors:** Specific error messages from the API

All errors include context about the network and operation that failed.

## License

MIT

## Support

For support and questions:
- GitHub Issues: [https://github.com/crossera/crossera-sdk/issues](https://github.com/crossera/crossera-sdk/issues)
- Documentation: [https://crossera.vercel.app](https://crossera.vercel.app)
