import React, { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import ProposalBoard from './ProposalBoard';
import DAOParticipationStatus from './DAOParticipationStatus';
import BuildingCatalogue from './BuildingCatalogue';
import ConstructionPlanningPanel from './ConstructionPlanningPanel';
import ConstructionProgressTracker from './ConstructionProgressTracker';
import ProgressTracker from './ProgressTracker';
import GovernanceDashboard from './GovernanceDashboard';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../styles/dashboard.css';

const GovernanceConstructionPanel = () => {
  const [dashboard, setDashboard] = useState('governance');
  const navigate = useNavigate();

  const handleNavigateToCrisis = () => {
    navigate('/crisis-management');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to right, #000033, #000000)',
        color: 'white',
        fontFamily: 'Orbitron, sans-serif',
      }}
    >
      {/* Sticky Header */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 51, 0.95)',
        backdropFilter: 'blur(8px)',
        p: 2,
        borderBottom: '1px solid rgba(58,255,221,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
        <Button
          variant={dashboard === 'governance' ? 'contained' : 'outlined'}
          sx={{ 
            borderColor: '#00FFFF', 
            color: dashboard === 'governance' ? '#000' : '#00FFFF',
            backgroundColor: dashboard === 'governance' ? '#00FFFF' : 'transparent',
            mr: 1,
            '&:hover': {
              borderColor: '#3affdd',
              backgroundColor: dashboard === 'governance' ? '#3affdd' : 'rgba(58,255,221,0.1)'
            }
          }}
          onClick={() => setDashboard('governance')}
        >
          Governance Dashboard
        </Button>
        <Button
          variant={dashboard === 'construction' ? 'contained' : 'outlined'}
          sx={{ 
            borderColor: '#00FFFF', 
            color: dashboard === 'construction' ? '#000' : '#00FFFF',
            backgroundColor: dashboard === 'construction' ? '#00FFFF' : 'transparent',
              mr: 1,
            '&:hover': {
              borderColor: '#3affdd',
              backgroundColor: dashboard === 'construction' ? '#3affdd' : 'rgba(58,255,221,0.1)'
            }
          }}
          onClick={() => setDashboard('construction')}
        >
          Construction Dashboard
        </Button>
          <Button
            variant={dashboard === 'dao' ? 'contained' : 'outlined'}
            sx={{ 
              borderColor: '#00FFFF', 
              color: dashboard === 'dao' ? '#000' : '#00FFFF',
              backgroundColor: dashboard === 'dao' ? '#00FFFF' : 'transparent',
              '&:hover': {
                borderColor: '#3affdd',
                backgroundColor: dashboard === 'dao' ? '#3affdd' : 'rgba(58,255,221,0.1)'
              }
            }}
            onClick={() => setDashboard('dao')}
          >
            DAO Governance
          </Button>
        </Box>
        <Typography
          sx={{
            color: '#3affdd',
            fontFamily: 'Orbitron',
            fontSize: '1.2rem',
            textShadow: '0 0 10px rgba(58,255,221,0.5)',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}
        >
          Cyberpunk City Builder
        </Typography>
      </Box>

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 3,
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#3affdd',
            borderRadius: '4px',
            '&:hover': {
              background: '#2de0c4',
            },
          },
        }}
      >
        {dashboard === 'governance' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <ProposalBoard 
                  isWalletConnected={true} 
                  onSelectProposal={(id: number) => {
                    console.log(`Proposal selected with ID: ${id}`);
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <DAOParticipationStatus />
              </Box>
            </Grid>
          </Grid>
        ) : dashboard === 'construction' ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: '#3affdd',
                  fontFamily: 'Orbitron',
                  fontSize: '1.5rem',
                  mb: 3,
                  textShadow: '0 0 10px rgba(58,255,221,0.5)'
                }}
              >
                Construction Management
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 4 }}>
                <BuildingCatalogue />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                mb: 4,
                height: 'auto',
                minHeight: '500px',
                '& > *': { height: '100%' }
              }}>
                <ConstructionPlanningPanel />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                mb: 4,
                height: 'auto',
                minHeight: '500px',
                '& > *': { height: '100%' }
              }}>
                <ConstructionProgressTracker />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <ProgressTracker />
              </Box>
            </Grid>
            
            {/* Crisis Management Navigation Button */}
            <Box
              sx={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 100
              }}
            >
              <Button
                variant="contained"
                onClick={handleNavigateToCrisis}
                sx={{
                  backgroundColor: '#3affdd',
                  color: '#000',
                  borderRadius: '50px',
                  padding: '12px 24px',
                  fontFamily: 'Orbitron',
                  fontWeight: 'bold',
                  boxShadow: '0 0 15px rgba(58,255,221,0.5)',
                  '&:hover': {
                    backgroundColor: '#2de0c4',
                    boxShadow: '0 0 20px rgba(58,255,221,0.7)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Crisis Management
                <ArrowForwardIcon />
              </Button>
            </Box>
          </Grid>
        ) : (
          <Box
            sx={{
              animation: 'fadeIn 0.5s ease-in',
              '& > *': {
                animation: 'slideUp 0.5s ease-out'
              }
            }}
          >
            <GovernanceDashboard />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GovernanceConstructionPanel; 