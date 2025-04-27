import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Typography, Stepper, Step, StepLabel, CircularProgress, Paper, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TokenIcon from '@mui/icons-material/Token';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { WalletService } from '../services/wallet';
import SoundService from '../services/SoundService';
import './OnboardingDashboard.css';

const NFT_CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Your Monad NFT contract

const NFT_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const CyberContainer = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  margin: 0,
  padding: 0,
  background: 'linear-gradient(135deg, #000000, #1a1a1a)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    background: 'repeating-linear-gradient(45deg, #00f2fe15 0px, transparent 2px, transparent 50px)',
    animation: 'grid-animation 20s linear infinite',
    zIndex: 1
  }
});

const CyberContent = styled(Box)({
  height: '100vh',
  overflowY: 'auto',
  padding: '2rem',
  position: 'relative',
  zIndex: 2,
  '&::-webkit-scrollbar': {
    width: '8px',
    background: 'rgba(0, 242, 254, 0.1)'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #00f2fe, #4facfe)',
    borderRadius: '4px'
  }
});

const CyberButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
  border: 0,
  color: 'black',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(0, 242, 254, .3)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    '&::before': {
      transform: 'translateX(100%)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transition: 'transform 0.5s',
  }
}));

const CyberPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 242, 254, 0.3)',
  borderRadius: '10px',
  padding: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)',
  }
}));

const OnboardingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [walletService, setWalletService] = useState<WalletService | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [nftMinted, setNftMinted] = useState(false);

  useEffect(() => {
    try {
      const service = new WalletService();
      setWalletService(service);
      
      // Listen for network changes
      service.listenToNetworkChanges((chainId) => {
        if (chainId !== '0x2777') { // Monad Testnet chainId
          setError('Please switch to Monad Testnet');
        } else {
          setError(null);
        }
      });

      // Listen for account changes
      service.listenToAccountChanges((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setActiveStep(0);
        }
      });
    } catch (err) {
      setError('Please install a compatible wallet');
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      SoundService.play('click');

      if (!walletService) {
        throw new Error('Wallet service not initialized');
      }

      const { address, isMonad } = await walletService.connect();
      
      if (!isMonad) {
        throw new Error('Please switch to Monad Testnet');
      }

      setAccount(address);
      setActiveStep(1);
      SoundService.play('success');
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      SoundService.play('error');
    } finally {
      setIsLoading(false);
    }
  };

  const mintNFT = async () => {
    try {
      setIsLoading(true);
      setError(null);
      SoundService.play('click');

      if (!walletService) {
        throw new Error('Wallet service not initialized');
      }

      const txHash = await walletService.mintCitizenNFT(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI);
      console.log('NFT Minted:', txHash);

      setNftMinted(true);
      setActiveStep(2);
      SoundService.play('success');
    } catch (err: any) {
      setError(err.message || 'Failed to mint NFT');
      SoundService.play('error');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    'Connect Wallet',
    'Mint CitizenNFT',
    'Receive GreenPoints'
  ];

  return (
    <CyberContainer>
      <CyberContent>
        <AnimatePresence>
          <motion.div
            className="onboarding-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <CyberPaper elevation={3}>
              <motion.div
                className="cyber-header"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Typography variant="h4" className="cyber-title">
                  Welcome to Civic Quest
                </Typography>
              </motion.div>

              <Stepper activeStep={activeStep} alternativeLabel className="cyber-stepper">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box className="content-section">
                {activeStep === 0 && (
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                  >
                    <Typography variant="h6">Connect your wallet to begin</Typography>
                    <CyberButton
                      onClick={connectWallet}
                      disabled={isLoading}
                      startIcon={<AccountBalanceWalletIcon />}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Connect Wallet'}
                    </CyberButton>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                  >
                    <Typography variant="h6">Mint your CitizenNFT</Typography>
                    <Box className="nft-preview">
                      {/* Add your NFT preview image here */}
                    </Box>
                    <CyberButton
                      onClick={mintNFT}
                      disabled={isLoading || !account}
                      startIcon={<VpnKeyIcon />}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Mint CitizenNFT'}
                    </CyberButton>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                  >
                    <Typography variant="h6">Congratulations!</Typography>
                    <Box className="token-display">
                      <TokenIcon fontSize="large" />
                      <Typography variant="h5">500 GP</Typography>
                      <Tooltip title="Use GreenPoints to vote, build, and manage your city">
                        <IconButton>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <CyberButton
                      onClick={() => navigate('/city-selection')}
                      startIcon={<TokenIcon />}
                    >
                      Enter the City
                    </CyberButton>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-message"
                  >
                    <Typography color="error">{error}</Typography>
                  </motion.div>
                )}
              </Box>
            </CyberPaper>
          </motion.div>
        </AnimatePresence>
      </CyberContent>
    </CyberContainer>
  );
};

export default OnboardingDashboard;