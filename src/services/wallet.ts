import { ethers } from 'ethers';

const MONAD_TESTNET = {
  chainId: '0x279F',  // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MONAD',
    symbol: 'MON',
    decimals: 18
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz/'],
  blockExplorerUrls: ['https://monad-testnet.socialscan.io/']
};

export class WalletService {
  private provider: ethers.BrowserProvider;
  private isMonadNetwork: boolean = false;

  constructor() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    } else {
      throw new Error('Please install a Monad-compatible wallet');
    }
  }

  async switchToMonadNetwork(): Promise<boolean> {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
      this.isMonadNetwork = true;
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
          this.isMonadNetwork = true;
          return true;
        } catch (addError) {
          console.error('Failed to add Monad network:', addError);
          return false;
        }
      }
      console.error('Failed to switch to Monad network:', switchError);
      return false;
    }
  }

  async connect(): Promise<{ address: string; balance: string; isMonad: boolean }> {
    const accounts = await this.provider.send('eth_requestAccounts', []);
    const address = accounts[0] as string;
    
    // Ensure we're on Monad network
    const isMonad = await this.switchToMonadNetwork();
    
    const balanceBN = await this.provider.getBalance(address);
    return {
      address,
      balance: ethers.formatEther(balanceBN),
      isMonad
    };
  }

  async mintCitizenNFT(contractAddress: string, abi: ethers.InterfaceAbi): Promise<string> {
    try {
      const contract = await this.getContract(contractAddress, abi);
      const tx = await contract.mint({ value: ethers.parseEther("0.1") });
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to mint CitizenNFT:', error);
      throw error;
    }
  }

  async getContract(address: string, abi: ethers.InterfaceAbi): Promise<ethers.Contract> {
    if (!this.isMonadNetwork) {
      await this.switchToMonadNetwork();
    }
    return new ethers.Contract(address, abi, await this.getSigner());
  }

  async getSigner(): Promise<ethers.Signer> {
    return await this.provider.getSigner();
  }

  async getBalance(address: string): Promise<string> {
    const bal = await this.provider.getBalance(address);
    return ethers.formatEther(bal);
  }

  async signMessage(message: string): Promise<string> {
    return (await this.getSigner()).signMessage(message);
  }

  async listenToNetworkChanges(callback: (chainId: string) => void): Promise<void> {
    (window as any).ethereum.on('chainChanged', callback);
  }

  async listenToAccountChanges(callback: (accounts: string[]) => void): Promise<void> {
    (window as any).ethereum.on('accountsChanged', callback);
  }
}
