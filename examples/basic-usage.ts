import { CrossEraSDK, Network } from '@crossera/sdk';

async function basicUsage() {
  // Initialize SDK
  const sdk = new CrossEraSDK();

  console.log('Available networks:', sdk.getAvailableNetworks());

  // Example address and transaction hash
  const address = '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF';
  const transactionHash = '0xede6251cb0667ac7a2b51bbb9308c5b244321fe4dbb9145e1a084e6bc84053de';

  try {
    // Get app ID on testnet
    console.log('\n=== Getting App ID ===');
    const appId = await sdk.getAppIdByAddress({
      address,
      network: 'testnet'
    });

    if (appId) {
      console.log(`App ID found: ${appId}`);
    } else {
      console.log('No app ID found for this address');
    }

    // Get network configuration
    console.log('\n=== Network Configuration ===');
    const testnetConfig = sdk.getNetworkConfig('testnet');
    console.log('Testnet config:', testnetConfig);

    // Submit transaction (uncomment to test)
    // console.log('\n=== Submitting Transaction ===');
    // const result = await sdk.submitTransaction({
    //   transactionHash,
    //   network: 'testnet'
    // });
    // console.log('Transaction result:', result);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run example
basicUsage();
