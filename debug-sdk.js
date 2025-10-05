import { CrossEraSDK } from './dist/index.esm.js';

async function debugSDK() {
  console.log('🔍 Debugging SDK Network Configuration');
  console.log('=====================================\n');

  const sdk = new CrossEraSDK();
  
  // Get network configs
  console.log('Network Configurations:');
  const networks = sdk.getAvailableNetworks();
  
  networks.forEach(network => {
    const config = sdk.getNetworkConfig(network);
    console.log(`\n${network.toUpperCase()}:`);
    console.log(`  Base URL: ${config.baseUrl}`);
    console.log(`  Chain ID: ${config.chainId}`);
    console.log(`  Name: ${config.name}`);
  });

  // Test direct API call to see what's happening
  console.log('\n🔍 Testing Direct API Call...');
  
  const testHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  
  try {
    // Get the client directly to see what URL it's using
    const client = sdk.apiClient.getClient('mainnet');
    console.log(`Client base URL: ${client.defaults.baseURL}`);
    
    // Try the API call
    console.log(`\nTrying POST to: ${client.defaults.baseURL}/api/sdk/submit`);
    console.log(`With data: ${JSON.stringify({ transaction_hash: testHash })}`);
    
    const response = await client.post('/api/sdk/submit', {
      transaction_hash: testHash
    });
    
    console.log('✅ Direct API call successful:', response.data);
    
  } catch (error) {
    console.error('❌ Direct API call failed:');
    console.error(`   Status: ${error.status}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   URL: ${error.config?.url}`);
    console.error(`   Base URL: ${error.config?.baseURL}`);
    
    if (error.response) {
      console.error(`   Response Status: ${error.response.status}`);
      console.error(`   Response Data:`, error.response.data);
    }
  }
}

debugSDK();
