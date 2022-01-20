import { Injectable } from '@angular/core';
import { EnvService } from '../env/env.service';
import detectMetamask from '@metamask/detect-provider';

@Injectable({
  providedIn: 'root',
})
export class MetamaskProviderService {
  constructor(private envService: EnvService) {}

  getFullNetworkName() {
    return this.envService.fullNetworkName;
  }

  public async importMetamaskConf() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metamaskProvider: any = await detectMetamask({
        mustBeMetaMask: true,
      });

      if (!metamaskProvider) {
        throw new Error('MetaMask not detected');
      }

      await metamaskProvider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${this.envService.chainId.toString(16)}`, // Hexadecimal version of chain ID
            chainName: this.envService.networkName,
            nativeCurrency: {
              name: this.envService.currencyName,
              symbol: this.envService.currencySymbol,
              decimals: 18,
            },
            rpcUrls: [this.envService.rpcUrl],
            blockExplorerUrls: [this.envService.blockExplorerUrl],
            iconUrls: [''],
          },
        ],
      });
      window.location.reload();
    } catch (addError) {
      console.log('Did not add network');
    }
  }
}
