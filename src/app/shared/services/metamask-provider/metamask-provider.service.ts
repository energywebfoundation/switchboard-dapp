import { Injectable } from '@angular/core';
import { EnvService } from '../env/env.service';
import detectMetamask from '@metamask/detect-provider';

interface MetamaskRequestProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

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
      const metamaskProvider = await this.detectMetamaskProvider();
      const chainId = this.getHexChainId();

      await metamaskProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId,
          },
        ],
      });
      window.location.reload();
    } catch (switchError) {
      if (!this.isUnknownChainError(switchError)) {
        console.error('Did not switch network', switchError);
        return;
      }

      await this.addNetwork();
    }
  }

  private async addNetwork() {
    try {
      const metamaskProvider = await this.detectMetamaskProvider();
      const chainId = this.getHexChainId();

      await metamaskProvider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId,
            chainName: this.envService.networkName,
            nativeCurrency: {
              name: this.envService.currencyName,
              symbol: this.envService.currencySymbol,
              decimals: 18,
            },
            rpcUrls: [this.envService.rpcUrl],
            blockExplorerUrls: [this.envService.blockExplorerUrl],
          },
        ],
      });

      await metamaskProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId,
          },
        ],
      });

      window.location.reload();
    } catch (addError) {
      console.error('Did not add network', addError);
    }
  }

  private async detectMetamaskProvider(): Promise<MetamaskRequestProvider> {
    const metamaskProvider: unknown = await detectMetamask({
      mustBeMetaMask: true,
    });

    if (!this.isMetamaskRequestProvider(metamaskProvider)) {
      throw new Error('MetaMask not detected');
    }

    return metamaskProvider;
  }

  private isMetamaskRequestProvider(
    provider: unknown
  ): provider is MetamaskRequestProvider {
    return (
      typeof provider === 'object' &&
      provider !== null &&
      'request' in provider &&
      typeof (provider as { request?: unknown }).request === 'function'
    );
  }

  private getHexChainId() {
    return `0x${this.envService.chainId.toString(16)}`;
  }

  private isUnknownChainError(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 4902
    );
  }
}
