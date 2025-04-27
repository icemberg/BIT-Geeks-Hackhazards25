import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

interface Proposal {
  id: number;
  title: string;
  description: string;
  votes: number;
  status: 'Active' | 'Completed' | 'Pending';
  deadline: string;
}

interface DAOStats {
  totalParticipants: number;
  activeProposals: number;
  totalVotes: number;
  participationRate: number;
}

const mockDAOStats: DAOStats = {
  totalParticipants: 1250,
  activeProposals: 8,
  totalVotes: 3420,
  participationRate: 78
};

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "City Park Development",
    description: "Develop a new park with recreational facilities in the downtown area",
    votes: 156,
    status: 'Active',
    deadline: "2024-04-01"
  },
  {
    id: 2,
    title: "Public Transportation Expansion",
    description: "Extend metro lines to suburban areas to improve connectivity",
    votes: 234,
    status: 'Active',
    deadline: "2024-04-15"
  },
  {
    id: 3,
    title: "Smart Street Lighting",
    description: "Implement energy-efficient LED street lights with smart controls",
    votes: 89,
    status: 'Pending',
    deadline: "2024-05-01"
  }
];

interface ProposalBoardProps {
  onSelectProposal?: (id: number) => void;
  isWalletConnected?: boolean;
}

const ProposalBoard: React.FC<ProposalBoardProps> = ({ 
  onSelectProposal,
  isWalletConnected: externalWalletStatus 
}) => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [isWalletConnected, setIsWalletConnected] = useState(externalWalletStatus || false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature');
        return;
      }

      setIsConnecting(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWalletAddress(await signer.getAddress());
      setIsWalletConnected(true);
      setShowWalletDialog(false);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Error connecting to MetaMask. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectWalletConnect = async () => {
    // Implement WalletConnect integration here
    alert('WalletConnect integration coming soon!');
  };

  const handleVote = async (proposalId: number, vote: boolean) => {
    if (!isWalletConnected) {
      setShowWalletDialog(true);
      return;
    }

    try {
      setIsConnecting(true);
      
      // Mock voting transaction for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect the vote
      setProposals(prevProposals =>
        prevProposals.map(proposal =>
          proposal.id === proposalId
            ? {
                ...proposal,
                votes: proposal.votes + (vote ? 1 : -1),
                status: proposal.votes > 150 ? 'Completed' : 'Active'
              }
            : proposal
        )
      );

      // Close the detail dialog after voting
      setShowDetailDialog(false);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowDetailDialog(true);
    if (onSelectProposal) {
      onSelectProposal(proposal.id);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      bgcolor: '#000',
      color: 'white',
      p: 3,
      overflowY: 'auto'
    }}>
      {/* Header with Wallet Status */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography
          sx={{
            color: '#3affdd',
            fontFamily: 'Orbitron',
            fontSize: '2rem',
            textShadow: '0 0 10px rgba(58,255,221,0.5)'
          }}
        >
          Governance Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isWalletConnected ? (
            <Typography sx={{ color: '#3affdd' }}>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Typography>
          ) : (
            <Button
              onClick={() => setShowWalletDialog(true)}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                color: '#3affdd',
                border: '1px solid #3affdd',
                '&:hover': {
                  bgcolor: 'rgba(58,255,221,0.1)'
                }
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>

      {/* DAO Participation Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(58,255,221,0.2)',
            p: 3,
            height: '100%'
          }}>
            <Typography sx={{ color: '#3affdd', mb: 1 }}>Total Participants</Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>{mockDAOStats.totalParticipants}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(58,255,221,0.2)',
            p: 3,
            height: '100%'
          }}>
            <Typography sx={{ color: '#3affdd', mb: 1 }}>Active Proposals</Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>{mockDAOStats.activeProposals}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(58,255,221,0.2)',
            p: 3,
            height: '100%'
          }}>
            <Typography sx={{ color: '#3affdd', mb: 1 }}>Total Votes</Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>{mockDAOStats.totalVotes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(58,255,221,0.2)',
            p: 3,
            height: '100%'
          }}>
            <Typography sx={{ color: '#3affdd', mb: 1 }}>Participation Rate</Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>{mockDAOStats.participationRate}%</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Existing Proposals Grid */}
      <Typography
        sx={{
          color: '#3affdd',
          fontFamily: 'Orbitron',
          fontSize: '1.5rem',
          mb: 3
        }}
      >
        Active Proposals
      </Typography>
      
      {/* Proposals Grid */}
      <Box sx={{
        maxHeight: 'calc(100vh - 400px)',
        overflow: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(58,255,221,0.3)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(58,255,221,0.5)',
          },
        },
      }}>
        <Grid container spacing={3}>
          {proposals.map((proposal) => (
            <Grid item xs={12} md={6} lg={4} key={proposal.id}>
              <Paper
                onClick={() => handleProposalClick(proposal)}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(58,255,221,0.2)',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 20px rgba(58,255,221,0.2)',
                    borderColor: '#3affdd'
                  }
                }}
              >
                <Typography
                  sx={{
                    color: '#3affdd',
                    fontFamily: 'Orbitron',
                    fontSize: '1.1rem',
                    mb: 1
                  }}
                >
                  {proposal.title}
                </Typography>
                <Box sx={{ 
                  flex: 1, 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(58,255,221,0.2)',
                    borderRadius: '2px',
                  },
                }}>
                  <Typography sx={{ 
                    mb: 1, 
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem'
                  }}>
                    {proposal.description}
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <Typography sx={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    mb: 0.5,
                    fontSize: '0.85rem'
                  }}>
                    Votes: {proposal.votes}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(proposal.votes / 300) * 100}
                    sx={{
                      bgcolor: 'rgba(58,255,221,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#3affdd'
                      }
                    }}
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1
                  }}>
                    <Typography
                      sx={{
                        color: proposal.status === 'Active' ? '#00ff00' : 
                              proposal.status === 'Pending' ? '#ffaa00' : '#3affdd',
                        fontSize: '0.85rem'
                      }}
                    >
                      {proposal.status}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Detailed Proposal Dialog */}
      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            border: '1px solid #3affdd',
            boxShadow: '0 0 20px rgba(58,255,221,0.3)',
          }
        }}
      >
        {selectedProposal && (
          <>
            <DialogTitle sx={{ 
              color: '#3affdd',
              fontFamily: 'Orbitron',
              borderBottom: '1px solid rgba(58,255,221,0.2)'
            }}>
              {selectedProposal.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ color: 'white', mb: 2 }}>
                  {selectedProposal.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#3affdd', mb: 1 }}>
                    Voting Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedProposal.votes / 300) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'rgba(58,255,221,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#3affdd'
                      }
                    }}
                  />
                  <Typography sx={{ color: 'white', mt: 1 }}>
                    Total Votes: {selectedProposal.votes}
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Paper sx={{
                      p: 2,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(58,255,221,0.2)',
                    }}>
                      <Typography sx={{ color: '#3affdd' }}>Status</Typography>
                      <Typography sx={{ color: 'white' }}>{selectedProposal.status}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{
                      p: 2,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(58,255,221,0.2)',
                    }}>
                      <Typography sx={{ color: '#3affdd' }}>Deadline</Typography>
                      <Typography sx={{ color: 'white' }}>{selectedProposal.deadline}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setShowDetailDialog(false)}
                sx={{ color: '#3affdd' }}
              >
                Close
              </Button>
              {selectedProposal.status === 'Active' && (
                <>
                  <Button
                    onClick={() => handleVote(selectedProposal.id, true)}
                    sx={{
                      bgcolor: 'rgba(58,255,221,0.1)',
                      color: '#3affdd',
                      border: '1px solid #3affdd',
                      '&:hover': {
                        bgcolor: 'rgba(58,255,221,0.2)'
                      }
                    }}
                  >
                    Vote Yes
                  </Button>
                  <Button
                    onClick={() => handleVote(selectedProposal.id, false)}
                    sx={{
                      bgcolor: 'rgba(58,255,221,0.1)',
                      color: '#3affdd',
                      border: '1px solid #3affdd',
                      '&:hover': {
                        bgcolor: 'rgba(58,255,221,0.2)'
                      }
                    }}
                  >
                    Vote No
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Wallet Connection Dialog */}
      <Dialog
        open={showWalletDialog}
        onClose={() => !isConnecting && setShowWalletDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            border: '1px solid #3affdd',
            boxShadow: '0 0 20px rgba(58,255,221,0.3)',
            minWidth: '300px'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#3affdd',
          fontFamily: 'Orbitron',
          textAlign: 'center'
        }}>
          Connect Wallet
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            p: 2
          }}>
            <Button
              variant="outlined"
              onClick={handleConnectMetaMask}
              disabled={isConnecting}
              startIcon={isConnecting ? <CircularProgress size={20} /> : <AccountBalanceWalletIcon />}
              sx={{
                color: '#3affdd',
                borderColor: '#3affdd',
                '&:hover': {
                  borderColor: '#3affdd',
                  bgcolor: 'rgba(58,255,221,0.1)'
                }
              }}
            >
              {isConnecting ? 'Connecting...' : 'MetaMask'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleConnectWalletConnect}
              disabled={isConnecting}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                color: '#3affdd',
                borderColor: '#3affdd',
                '&:hover': {
                  borderColor: '#3affdd',
                  bgcolor: 'rgba(58,255,221,0.1)'
                }
              }}
            >
              WalletConnect
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={() => setShowWalletDialog(false)}
            disabled={isConnecting}
            sx={{ color: '#3affdd' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProposalBoard;