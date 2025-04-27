import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const providerOptions = {
    walletconnect: {
        package: 'walletconnect',
        options: {
            rpc: {
                [process.env.REACT_APP_CHAIN_ID || '1234']: process.env.REACT_APP_MONAD_RPC_URL || 'https://testnet.monad.xyz'
            }
        }
    },
    metamask: {
        package: 'metamask',
        options: {
            rpc: {
                [process.env.REACT_APP_CHAIN_ID || '1234']: process.env.REACT_APP_MONAD_RPC_URL || 'https://testnet.monad.xyz'
            }
        }
    }
};

const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    theme: "dark"
});

export class WalletManager {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.Signer | null = null;

    async connect(): Promise<string> {
        try {
            const instance = await web3Modal.connect();
            this.provider = new ethers.BrowserProvider(instance);
            
            // Add Monad network if not present
            try {
                await this.provider.send('wallet_addEthereumChain', [{
                    chainId: `0x${Number(process.env.REACT_APP_CHAIN_ID || '1234').toString(16)}`,
                    chainName: 'Monad Testnet',
                    nativeCurrency: {
                        name: 'MONAD',
                        symbol: 'MONAD',
                        decimals: 18
                    },
                    rpcUrls: [process.env.REACT_APP_MONAD_RPC_URL || 'https://testnet.monad.xyz'],
                    blockExplorerUrls: ['https://testnet.monad.xyz']
                }]);
            } catch (error) {
                console.log('Network already added or error adding network:', error);
            }
            
            this.signer = await this.provider.getSigner();
            return await this.signer.getAddress();
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        await web3Modal.clearCachedProvider();
        this.provider = null;
        this.signer = null;
    }

    getProvider(): ethers.BrowserProvider | null {
        return this.provider;
    }

    getSigner(): ethers.Signer | null {
        return this.signer;
    }

    isConnected(): boolean {
        return this.provider !== null;
    }
} 