# CrossEra SDK v1.1.0 - Release Notes

## 🎉 New Features: Batch Processing Support

Version 1.1.0 introduces batch processing capabilities, allowing efficient submission and tracking of transactions that are processed daily.

---

## ✨ What's New

### **1. Batch Processing Support**

Submit transactions for batch processing instead of immediate processing:

```typescript
const sdk = new CrossEraSDK();

// Submit transaction for batch processing (processed daily at 00:00 UTC)
const result = await sdk.submitForProcessing({
  transactionHash: '0x...',
  network: 'mainnet',
  appId: 'my-app-id',      // Optional
  userAddress: '0x...'     // Optional
});

console.log('Status:', result.status);                    // 'pending'
console.log('Estimated time:', result.estimatedProcessingTime); // '~14 hours'
console.log('ID:', result.id);                           // UUID for tracking
```

### **2. Transaction Status Tracking**

Check the status of batch-processed transactions:

```typescript
const status = await sdk.getTransactionStatus({
  transactionHash: '0x...',
  network: 'mainnet'
});

console.log('Current status:', status.status);           // 'completed'
console.log('Process TX Hash:', status.processTxHash);   // On-chain proof
console.log('Retry count:', status.retryCount);          // 0
console.log('Batch info:', status.batchInfo);            // Batch details
```

---

## 🔧 Breaking Changes

### **Request Format Changed**

The batch processing endpoints now use **camelCase** instead of snake_case:

**Before (v1.0.x)**:
```typescript
{
  transaction_hash: '0x...',  // ❌ Old format
  app_id: '...',
  user_address: '0x...'
}
```

**After (v1.1.0)**:
```typescript
{
  transactionHash: '0x...',   // ✅ New format
  network: 'mainnet',         // ✅ Now required
  appId: '...',              // ✅ Optional
  userAddress: '0x...'       // ✅ Optional
}
```

### **ID Type Changed**

- Database ID changed from `number` to `string` (UUID format)
- `BatchTransactionResult.id` is now a string
- `TransactionStatus.batchInfo.id` is now a string

---

## 📊 Enhanced Interfaces

### **TransactionStatus** (Enhanced)

```typescript
export interface TransactionStatus {
  transactionHash: string;
  appId: string;
  userAddress: string;
  network: string;              // ✅ NEW
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  submittedAt: string;
  processedAt?: string;
  processTxHash?: string;        // ✅ NEW - On-chain process TX hash
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  estimatedProcessingTime?: string; // ✅ NEW - For pending transactions
  batchInfo?: {
    id: string;                  // ✅ Changed from number to string
    startedAt: string;
    completedAt?: string;
    status: string;
  };
}
```

---

## 🚀 Usage Examples

### **Example 1: Submit and Track**

```typescript
import { CrossEraSDK } from 'crossera-sdk';

const sdk = new CrossEraSDK();

// Submit for batch processing
const result = await sdk.submitForProcessing({
  transactionHash: '0xabc123...',
  network: 'mainnet'
});

console.log('Submitted!');
console.log('Will be processed in:', result.estimatedProcessingTime);

// Poll for status
const interval = setInterval(async () => {
  const status = await sdk.getTransactionStatus({
    transactionHash: result.transactionHash,
    network: 'mainnet'
  });
  
  console.log('Status:', status.status);
  
  if (status.status === 'completed') {
    console.log('Processing complete!');
    console.log('Process TX:', status.processTxHash);
    clearInterval(interval);
  } else if (status.status === 'failed') {
    console.error('Processing failed:', status.errorMessage);
    clearInterval(interval);
  }
}, 60000); // Check every minute
```

### **Example 2: Handle Already Submitted**

```typescript
try {
  const result = await sdk.submitForProcessing({
    transactionHash: '0xabc123...',
    network: 'mainnet'
  });
} catch (error) {
  if (error.message.includes('already submitted')) {
    console.log('Transaction already in queue');
    
    // Check its status
    const status = await sdk.getTransactionStatus({
      transactionHash: '0xabc123...',
      network: 'mainnet'
    });
    
    console.log('Current status:', status.status);
  }
}
```

### **Example 3: Multi-Network Support**

```typescript
// Same transaction can be submitted on different networks
await sdk.submitForProcessing({
  transactionHash: '0xabc123...',
  network: 'mainnet'
});

await sdk.submitForProcessing({
  transactionHash: '0xabc123...',
  network: 'testnet'  // Different network, allowed!
});
```

---

## 🐛 Bug Fixes

- ✅ Fixed network parameter handling
- ✅ Improved error messages for 409 conflicts
- ✅ Better field name mapping (snake_case to camelCase)
- ✅ Fixed status endpoint to include network filter

---

## 📦 How to Upgrade

### **From v1.0.x to v1.1.0**

```bash
npm update crossera-sdk
```

Or for a fresh install:

```bash
npm install crossera-sdk@latest
```

### **Migration Guide**

The batch processing methods are **new additions**, so existing code using `submitTransaction()` will continue to work without changes.

If you want to use batch processing:

**Before (immediate processing)**:
```typescript
const result = await sdk.submitTransaction({
  transactionHash: '0x...',
  network: 'mainnet'
});
// Processed immediately
```

**After (batch processing)**:
```typescript
const result = await sdk.submitForProcessing({
  transactionHash: '0x...',
  network: 'mainnet'
});
// Queued for daily batch (processed at 00:00 UTC)
```

---

## 🔍 What's Next

- Support for webhook notifications when transactions are processed
- Bulk submission API for multiple transactions
- Enhanced analytics and statistics
- TypeScript strict mode support

---

## 📚 Documentation

Full documentation available at:
- GitHub: https://github.com/samthetutor/crossera-sdk
- NPM: https://www.npmjs.com/package/crossera-sdk

---

## 🆘 Support

- Report issues: https://github.com/samthetutor/crossera-sdk/issues
- Documentation: See README.md

---

**Published**: October 6, 2025  
**Version**: 1.1.0  
**License**: MIT

