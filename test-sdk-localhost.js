import { CrossEraSDK } from './dist/index.esm.js';

async function testSDKLocalhost() {
  console.log('🧪 Testing SDK with Localhost');
  console.log('==============================\n');

  // Initialize SDK
  const sdk = new CrossEraSDK();

  // Test transaction hash
  const testTxHash = '0x253bd1b184693e558a20021c58fb3acb37af7ce1cbbdff9df0cc6f5823f70a95';

  try {
    // First, let's check the network configuration
    console.log('📡 Network Configuration:');
    const networks = sdk.getAvailableNetworks();
    console.log(`   Available Networks: ${networks.join(', ')}`);
    
    networks.forEach(network => {
      const config = sdk.getNetworkConfig(network);
      console.log(`   ${network}: ${config.baseUrl}`);
    });

    // Test direct API call to localhost
    console.log('\n🌐 Testing direct API call to localhost...');
    
    const response = await fetch('http://localhost:3000/api/sdk/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_hash: testTxHash
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Direct API call successful:');
      console.log(`   Transaction Hash: ${result.data.transaction_hash}`);
      console.log(`   App ID: ${result.data.app_id}`);
      console.log(`   User Address: ${result.data.user_address}`);
      console.log(`   Status: ${result.data.status}`);
      console.log(`   Submitted At: ${result.data.submitted_at}`);
      console.log(`   Database ID: ${result.data.id}`);
    } else {
      console.log('❌ Direct API call failed:', result.error);
    }

    // Now test status endpoint
    console.log('\n📊 Testing status endpoint...');
    
    const statusResponse = await fetch(`http://localhost:3000/api/sdk/status/${testTxHash}`);
    const statusResult = await statusResponse.json();
    
    if (statusResult.success) {
      console.log('✅ Status check successful:');
      console.log(`   Status: ${statusResult.data.status}`);
      console.log(`   Retry Count: ${statusResult.data.retryCount}/${statusResult.data.maxRetries}`);
      console.log(`   Submitted At: ${statusResult.data.submittedAt}`);
    } else {
      console.log('❌ Status check failed:', statusResult.error);
    }

    console.log('\n🎉 Localhost API test completed!');
    console.log('\n📝 Note: SDK network configuration points to production URLs.');
    console.log('   For localhost testing, you need to:');
    console.log('   1. Start the local server: npm run dev');
    console.log('   2. Use the SDK with testnet network (points to localhost in dev)');
    console.log('   3. Or modify the network config for localhost testing');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSDKLocalhost();
