import { CrossEraSDK, Network } from '@crossera/sdk';

async function batchProcessingExample() {
  // Initialize SDK
  const sdk = new CrossEraSDK();

  // Example transaction hash for batch processing
  const transactionHash = '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468';

  try {
    console.log('=== Batch Processing Example ===\n');

    // Submit transaction for batch processing
    console.log('1. Submitting transaction for batch processing...');
    const batchResult = await sdk.submitForProcessing({
      transactionHash,
      network: 'mainnet'
    });

    console.log('✅ Batch submission successful:');
    console.log(`   Transaction Hash: ${batchResult.transactionHash}`);
    console.log(`   App ID: ${batchResult.appId}`);
    console.log(`   User Address: ${batchResult.userAddress}`);
    console.log(`   Status: ${batchResult.status}`);
    console.log(`   Submitted At: ${batchResult.submittedAt}`);
    console.log(`   Estimated Processing: ${batchResult.estimatedProcessingTime}`);
    console.log(`   Database ID: ${batchResult.id}`);

    // Check processing status
    console.log('\n2. Checking transaction processing status...');
    const status = await sdk.getTransactionStatus({
      transactionHash,
      network: 'mainnet'
    });

    console.log('📊 Current Status:');
    console.log(`   Status: ${status.status}`);
    console.log(`   Retry Count: ${status.retryCount}/${status.maxRetries}`);
    console.log(`   Submitted At: ${status.submittedAt}`);
    if (status.processedAt) {
      console.log(`   Processed At: ${status.processedAt}`);
    }
    if (status.errorMessage) {
      console.log(`   Error: ${status.errorMessage}`);
    }
    if (status.batchInfo) {
      console.log(`   Batch ID: ${status.batchInfo.id}`);
      console.log(`   Batch Status: ${status.batchInfo.status}`);
    }

    console.log('\n🎉 Batch processing example completed!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run example
batchProcessingExample();
