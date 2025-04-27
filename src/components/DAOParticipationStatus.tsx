import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import HowToVote from '@mui/icons-material/HowToVote';
import History from '@mui/icons-material/History';
import '../styles/dashboard.css';

const mockVoteHistory = [
  { id: 1, proposalTitle: 'Community Center Renovation', vote: 'Yes', date: '2024-02-01' },
  { id: 2, proposalTitle: 'New Public Library', vote: 'No', date: '2024-01-15' },
];

const totalProposals = 10;
const votedProposals = 2;

const DAOParticipationStatus = () => {
  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'Yes': return 'success.main';
      case 'No': return 'error.main';
      case 'Abstain': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        border: '1px solid #00FFFF',
        boxShadow: '0 4px 6px rgba(0, 255, 255, 0.3)',
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          gap: 1
        }}>
          <HowToVote sx={{ color: '#3affdd' }} />
          <Typography 
            variant="h6"
            sx={{ 
              color: '#3affdd',
              fontFamily: 'Orbitron',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              lineHeight: 1.2,
              m: 0
            }}
          >
            Your Participation Status
          </Typography>
        </Box>

        <Typography color="inherit" sx={{ fontSize: "1rem", mb: 2 }}>
          You've voted on {votedProposals} of {totalProposals} proposals
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(votedProposals / totalProposals) * 100}
          sx={{
            my: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 5,
            },
          }}
        />

        <Typography 
          variant="h6" 
          sx={{ 
            color: '#3affdd',
            fontFamily: 'Orbitron',
            fontSize: '1rem',
            mb: 2 
          }}
        >
          Vote History
        </Typography>

        <TableContainer 
          sx={{ 
            maxHeight: '200px',
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 1,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(58,255,221,0.5)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(58,255,221,0.7)',
              },
            },
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#3affdd', fontFamily: 'Orbitron', fontSize: '0.8rem', borderBottom: '1px solid rgba(58,255,221,0.2)' }}>Proposal</TableCell>
                <TableCell sx={{ color: '#3affdd', fontFamily: 'Orbitron', fontSize: '0.8rem', borderBottom: '1px solid rgba(58,255,221,0.2)' }}>Vote</TableCell>
                <TableCell sx={{ color: '#3affdd', fontFamily: 'Orbitron', fontSize: '0.8rem', borderBottom: '1px solid rgba(58,255,221,0.2)' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockVoteHistory.map((vote) => (
                <TableRow key={vote.id}>
                  <TableCell sx={{ color: 'white', fontSize: '0.8rem', borderBottom: '1px solid rgba(58,255,221,0.1)' }}>{vote.proposalTitle}</TableCell>
                  <TableCell sx={{ color: getVoteColor(vote.vote), fontSize: '0.8rem', borderBottom: '1px solid rgba(58,255,221,0.1)' }}>{vote.vote}</TableCell>
                  <TableCell sx={{ color: 'white', fontSize: '0.8rem', borderBottom: '1px solid rgba(58,255,221,0.1)' }}>{new Date(vote.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button 
          variant="outlined" 
          startIcon={<History />} 
          sx={{ 
            mt: 2,
            width: '100%',
            color: '#3affdd',
            borderColor: '#3affdd',
            fontFamily: 'Orbitron',
            fontSize: '0.9rem',
            '&:hover': {
              borderColor: '#3affdd',
              backgroundColor: 'rgba(58,255,221,0.1)'
            }
          }}
        >
          View Full History
        </Button>
      </Box>
    </Card>
  );
};

export default DAOParticipationStatus;
