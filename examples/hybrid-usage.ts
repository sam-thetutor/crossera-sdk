import { CrossEraSDK, Network } from '@crossera/sdk';

async function hybridUsageExample() {
  // Initialize SDK
  const sdk = new CrossEraSDK();

  // Example transaction hashes
  const immediateTxHash = '0xede6251cb0667ac7a2b51bbb9308c5b244321fe4dbb9145e1a084e6bc84053de';
  const batchTxHash = '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468';

  try {
    console.log('=== Hybrid Usage Example ===\n');
    console.log('This example shows both immediate and batch processing modes\n');

    // Example 1: Immediate Processing (for testing/playground)
    console.log('1. IMMEDIATE PROCESSING (for testing):');
    console.log('   Use submitTransaction() for immediate results');
    
    try {
      const immediateResult = await sdk.submitTransaction({
        transactionHash: immediateTxHash,
        network: 'testnet'
      });

      console.log('   ✅ Immediate processing successful:');
      console.log(`      Transaction: ${immediateResult.transactionHash}`);
      console.log(`      App ID: ${immediateResult.appId}`);
      console.log(`      Processed At: ${immediateResult.processedAt}`);
      console.log(`      Campaigns Updated: ${immediateResult.campaignsUpdated}`);
      
    } catch (error: any) {
      console.log('   ⚠️  Immediate processing failed (expected for testing):');
      console.log(`      Error: ${error.message}`);
    }

    console.log('\n2. BATCH PROCESSING (for production):');
    console.log('   Use submitForProcessing() for batch processing');
    
    try {
      const batchResult = await sdk.submitForProcessing({
        transactionHash: batchTxHash,
        network: 'mainnet'
      });

      console.log('   ✅ Batch submission successful:');
      console.log(`      Transaction: ${batchResult.transactionHash}`);
      console.log(`      App ID: ${batchResult.appId}`);
      console.log(`      Status: ${batchResult.status}`);
      console.log(`      Estimated Processing: ${batchResult.estimatedProcessingTime}`);

      // Check status after submission
      console.log('\n3. STATUS CHECKING:');
      const status = await sdk.getTransactionStatus({
        transactionHash: batchTxHash,
        network: 'mainnet'
      });

      console.log('   📊 Current Status:');
      console.log(`      Status: ${status.status}`);
      console.log(`      Retry Count: ${status.retryCount}/${status.maxRetries}`);
      
    } catch (error: any) {
      console.log('   ❌ Batch processing failed:');
      console.log(`      Error: ${error.message}`);
    }

    console.log('\n4. WHEN TO USE EACH MODE:');
    console.log('   🧪 submitTransaction() - For testing, playground, immediate feedback');
    console.log('   🏭 submitForProcessing() - For production, cost-effective batch processing');
    console.log('   📊 getTransactionStatus() - Check processing status anytime');

    console.log('\n🎉 Hybrid usage example completed!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run example
hybridUsageExample();
