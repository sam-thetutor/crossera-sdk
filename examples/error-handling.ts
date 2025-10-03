import { CrossEraSDK, Network } from '@crossera/sdk';

/**
 * Example demonstrating comprehensive error handling
 */
async function errorHandlingExample() {
  const sdk = new CrossEraSDK();
  
  console.log('=== Error Handling Examples ===\n');
  
  // Example 1: Invalid address
  console.log('1. Testing invalid address...');
  try {
    await sdk.getAppIdByAddress({
      address: 'invalid-address',
      network: 'testnet'
    });
  } catch (error) {
    console.log('✓ Caught invalid address error:', error.message);
  }
  
  // Example 2: Invalid transaction hash
  console.log('\n2. Testing invalid transaction hash...');
  try {
    await sdk.submitTransaction({
      transactionHash: 'invalid-hash',
      network: 'testnet'
    });
  } catch (error) {
    console.log('✓ Caught invalid hash error:', error.message);
  }
  
  // Example 3: Invalid network
  console.log('\n3. Testing invalid network...');
  try {
    await sdk.getAppIdByAddress({
      address: '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF',
      network: 'invalid-network' as Network
    });
  } catch (error) {
    console.log('✓ Caught invalid network error:', error.message);
  }
  
  // Example 4: Network error (non-existent address)
  console.log('\n4. Testing network error...');
  try {
    const appId = await sdk.getAppIdByAddress({
      address: '0x0000000000000000000000000000000000000000',
      network: 'testnet'
    });
    console.log('✓ No app ID found (returns null):', appId);
  } catch (error) {
    console.log('✓ Caught network error:', error.message);
  }
  
  // Example 5: Batch operations with error handling
  console.log('\n5. Testing batch operations...');
  const addresses = [
    '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF', // Valid address
    'invalid-address', // Invalid address
    '0x0000000000000000000000000000000000000000', // Non-existent address
  ];
  
  const results = await Promise.allSettled(
    addresses.map(address => 
      sdk.getAppIdByAddress({ address, network: 'testnet' })
    )
  );
  
  results.forEach((result, index) => {
    const address = addresses[index];
    if (result.status === 'fulfilled') {
      console.log(`✓ ${address}: ${result.value || 'No app ID found'}`);
    } else {
      console.log(`✗ ${address}: ${result.reason.message}`);
    }
  });
}

/**
 * Utility function for robust error handling in production
 */
export async function safeGetAppId(sdk: CrossEraSDK, address: string, network: Network) {
  try {
    const appId = await sdk.getAppIdByAddress({ address, network });
    return { success: true, appId, error: null };
  } catch (error: any) {
    return { 
      success: false, 
      appId: null, 
      error: {
        message: error.message,
        network,
        address
      }
    };
  }
}

/**
 * Utility function for robust transaction submission
 */
export async function safeSubmitTransaction(sdk: CrossEraSDK, transactionHash: string, network: Network) {
  try {
    const result = await sdk.submitTransaction({ transactionHash, network });
    return { success: true, result, error: null };
  } catch (error: any) {
    return { 
      success: false, 
      result: null, 
      error: {
        message: error.message,
        network,
        transactionHash
      }
    };
  }
}

// Run example
errorHandlingExample();
