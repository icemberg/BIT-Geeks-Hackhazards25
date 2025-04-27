import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  chainId: number;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0',
    chainId: 0
  });

  const connect = async () => {
    if (typeof (window as any).ethereum === 'undefined') {
      throw new Error('Please install MetaMask to continue');
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const balance = await provider.getBalance(accounts[0]);
      const network = await provider.getNetwork();

      setState({
        isConnected: true,
        address: accounts[0],
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId)
      });

      // Set up event listeners
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setState({
        isConnected: false,
        address: null,
        balance: '0',
        chainId: 0
      });
    } else {
      // Account changed
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const balance = await provider.getBalance(accounts[0]);
      setState(prev => ({
        ...prev,
        address: accounts[0],
        balance: ethers.formatEther(balance)
      }));
    }
  };

  const handleChainChanged = async (chainId: string) => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const network = await provider.getNetwork();
    setState(prev => ({
      ...prev,
      chainId: Number(network.chainId)
    }));
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if ((window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const balance = await provider.getBalance(accounts[0]);
            const network = await provider.getNetwork();

            setState({
              isConnected: true,
              address: accounts[0],
              balance: ethers.formatEther(balance),
              chainId: Number(network.chainId)
            });

            // Set up event listeners
            (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
            (window as any).ethereum.on('chainChanged', handleChainChanged);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Cleanup event listeners
    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    isConnected: state.isConnected,
    address: state.address,
    balance: state.balance,
    chainId: state.chainId,
    connect
  };
}; 