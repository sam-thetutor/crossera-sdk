import { CrossEraSDK, Network } from '@crossera/sdk';

async function statusMonitoringExample() {
  // Initialize SDK
  const sdk = new CrossEraSDK();

  // Example transaction hash to monitor
  const transactionHash = '0x753b2ea96cdf8dd1b5a822f4f40ea0678c3516b44946a78ae26863dc1425d468';

  try {
    console.log('=== Status Monitoring Example ===\n');

    // Check initial status
    console.log('1. Checking initial status...');
    const initialStatus = await sdk.getTransactionStatus({
      transactionHash,
      network: 'mainnet'
    });

    console.log('📊 Initial Status:');
    console.log(`   Status: ${initialStatus.status}`);
    console.log(`   Retry Count: ${initialStatus.retryCount}/${initialStatus.maxRetries}`);
    console.log(`   Submitted At: ${initialStatus.submittedAt}`);
    
    if (initialStatus.status === 'pending') {
      console.log('   ⏳ Transaction is pending batch processing');
    } else if (initialStatus.status === 'processing') {
      console.log('   🔄 Transaction is currently being processed');
    } else if (initialStatus.status === 'completed') {
      console.log('   ✅ Transaction processing completed');
      if (initialStatus.processedAt) {
        console.log(`   Processed At: ${initialStatus.processedAt}`);
      }
    } else if (initialStatus.status === 'failed') {
      console.log('   ❌ Transaction processing failed');
      if (initialStatus.errorMessage) {
        console.log(`   Error: ${initialStatus.errorMessage}`);
      }
    }

    // Show batch information if available
    if (initialStatus.batchInfo) {
      console.log('\n📦 Batch Information:');
      console.log(`   Batch ID: ${initialStatus.batchInfo.id}`);
      console.log(`   Batch Status: ${initialStatus.batchInfo.status}`);
      console.log(`   Started At: ${initialStatus.batchInfo.startedAt}`);
      if (initialStatus.batchInfo.completedAt) {
        console.log(`   Completed At: ${initialStatus.batchInfo.completedAt}`);
      }
    }

    // Demonstrate status checking workflow
    console.log('\n2. Status Checking Workflow:');
    console.log('   You can check status anytime using:');
    console.log('   ```typescript');
    console.log('   const status = await sdk.getTransactionStatus({');
    console.log('     transactionHash: "0x...",');
    console.log('     network: "mainnet"');
    console.log('   });');
    console.log('   ```');

    console.log('\n🎉 Status monitoring example completed!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run example
statusMonitoringExample();
