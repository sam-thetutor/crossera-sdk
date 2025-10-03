import { AxiosInstance } from 'axios';
import { Network } from '../types/network';
export declare class CrossEraAPIClient {
    private clients;
    constructor();
    private initializeClients;
    private getErrorMessage;
    getClient(network: Network): AxiosInstance;
}
//# sourceMappingURL=client.d.ts.map