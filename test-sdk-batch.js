import { CrossEraSDK } from './dist/index.esm.js';

async function testSDKBatchProcessing() {
  console.log('🧪 Testing SDK Batch Processing');
  console.log('================================\n');

  // Initialize SDK
  const sdk = new CrossEraSDK();

  // Test transaction hash
  const testTxHash = '0x8e16c62d38e38dbc9464a2ca7e8b9d3069fb910254112bde710cc6cede5338bf';

  try {
    // Step 1: Submit transaction for batch processing
    console.log('1️⃣  Submitting transaction for batch processing...');
    console.log(`   Hash: ${testTxHash}`);
    
    const batchResult = await sdk.submitForProcessing({
      transactionHash: testTxHash,
      network: 'testnet'
    });

    console.log('✅ Batch submission successful:');
    console.log(`   Transaction Hash: ${batchResult.transactionHash}`);
    console.log(`   App ID: ${batchResult.appId}`);
    console.log(`   User Address: ${batchResult.userAddress}`);
    console.log(`   Status: ${batchResult.status}`);
    console.log(`   Submitted At: ${batchResult.submittedAt}`);
    console.log(`   Estimated Processing: ${batchResult.estimatedProcessingTime}`);
    console.log(`   Database ID: ${batchResult.id}`);

    // Step 2: Check processing status
    console.log('\n2️⃣  Checking transaction processing status...');
    
    const status = await sdk.getTransactionStatus({
      transactionHash: testTxHash,
      network: 'testnet'
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
      console.log(`   Batch Started: ${status.batchInfo.startedAt}`);
      if (status.batchInfo.completedAt) {
        console.log(`   Batch Completed: ${status.batchInfo.completedAt}`);
      }
    }

    // Step 3: Show available SDK methods
    console.log('\n3️⃣  Available SDK Methods:');
    const methods = Object.getOwnPropertyNames(CrossEraSDK.prototype)
      .filter(name => name !== 'constructor')
      .sort();
    
    methods.forEach((method, index) => {
      console.log(`   ${index + 1}. ${method}()`);
    });

    // Step 4: Test network configuration
    console.log('\n4️⃣  Network Configuration:');
    const networks = sdk.getAvailableNetworks();
    console.log(`   Available Networks: ${networks.join(', ')}`);
    
    const testnetConfig = sdk.getNetworkConfig('testnet');
    console.log(`   Testnet Config:`, testnetConfig);

    console.log('\n🎉 SDK batch processing test completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Run the manual processing script: node ../scripts/process-sdk-transactions.js');
    console.log('   2. Check status again to see if processing completed');
    console.log('   3. Verify the transaction appears in the leaderboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('Failed to submit transaction for batch processing')) {
      console.log('\n🔍 Troubleshooting:');
      console.log('   - Check if the transaction hash is valid');
      console.log('   - Verify the app is registered on-chain');
      console.log('   - Ensure the transaction is confirmed on blockchain');
    }
    
    if (error.message.includes('Failed to get transaction status')) {
      console.log('\n🔍 Troubleshooting:');
      console.log('   - Make sure the transaction was submitted first');
      console.log('   - Check if the transaction hash is correct');
    }
  }
}

// Run the test
testSDKBatchProcessing();
