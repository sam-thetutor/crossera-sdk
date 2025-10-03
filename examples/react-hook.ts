import { CrossEraSDK, Network } from '@crossera/sdk';
import { useCallback, useMemo } from 'react';

/**
 * React hook for CrossEra SDK functionality
 * This is an example of how to integrate the SDK with React
 */
export function useCrossEra(network: Network) {
  const sdk = useMemo(() => new CrossEraSDK(), []);
  
  const getAppId = useCallback(async (address: string) => {
    try {
      const appId = await sdk.getAppIdByAddress({ address, network });
      return appId;
    } catch (error) {
      console.error(`Failed to get app ID on ${network}:`, error);
      return null;
    }
  }, [sdk, network]);
  
  const submitTransaction = useCallback(async (transactionHash: string) => {
    try {
      const result = await sdk.submitTransaction({ transactionHash, network });
      return result;
    } catch (error) {
      console.error(`Failed to submit transaction on ${network}:`, error);
      throw error;
    }
  }, [sdk, network]);
  
  const getNetworkInfo = useCallback(() => {
    return sdk.getNetworkConfig(network);
  }, [sdk, network]);
  
  return { 
    getAppId, 
    submitTransaction, 
    getNetworkInfo,
    availableNetworks: sdk.getAvailableNetworks()
  };
}

/**
 * Example React component using the hook
 */
export function CrossEraComponent() {
  const { getAppId, submitTransaction, getNetworkInfo, availableNetworks } = useCrossEra('testnet');
  
  const handleGetAppId = async () => {
    const address = '0x46992B61b7A1d2e4F59Cd881B74A96a549EF49BF';
    const appId = await getAppId(address);
    console.log('App ID:', appId);
  };
  
  const handleSubmitTransaction = async () => {
    const hash = '0xede6251cb0667ac7a2b51bbb9308c5b244321fe4dbb9145e1a084e6bc84053de';
    try {
      const result = await submitTransaction(hash);
      console.log('Transaction result:', result);
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };
  
  const networkInfo = getNetworkInfo();
  
  return (
    <div>
      <h2>CrossEra SDK Example</h2>
      <p>Available networks: {availableNetworks.join(', ')}</p>
      <p>Current network: {networkInfo.name}</p>
      <p>Base URL: {networkInfo.baseUrl}</p>
      
      <button onClick={handleGetAppId}>
        Get App ID
      </button>
      
      <button onClick={handleSubmitTransaction}>
        Submit Transaction
      </button>
    </div>
  );
}
