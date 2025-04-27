import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button } from '@mui/material';

interface ProposalVotes {
  for: number;
  against: number;
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  votes: ProposalVotes;
  status: 'active' | 'passed' | 'failed';
  totalVotes?: number;
  deadline?: Date;
  creator?: string;
  createdAt?: Date;
}

interface DetailedProposalViewProps {
  proposal: Proposal;
  onClose: () => void;
}

const DetailedProposalView: React.FC<DetailedProposalViewProps> = ({
  proposal,
  onClose,
}) => {
  const calculatePercentage = (value: number) => {
    if (!proposal.totalVotes) return 0;
    return ((value / proposal.totalVotes) * 100).toFixed(1);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 255, 255, 0.3)', color: '#00FFFF' }}>
        {proposal.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: '#00FFFF', mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            {proposal.description}
          </Typography>

          <Typography variant="h6" sx={{ color: '#00FFFF', mb: 1 }}>
            Voting Statistics
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              For: {proposal.votes.for} ({calculatePercentage(proposal.votes.for)}%)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Against: {proposal.votes.against} ({calculatePercentage(proposal.votes.against)}%)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Total Votes: {proposal.totalVotes}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ color: '#00FFFF', mb: 1 }}>
            Details
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Status: {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Created by: {proposal.creator}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Created at: {proposal.createdAt?.toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Deadline: {proposal.deadline?.toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                color: '#00FFFF',
                borderColor: '#00FFFF',
                '&:hover': {
                  borderColor: '#00FFFF',
                  backgroundColor: 'rgba(0, 255, 255, 0.1)',
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedProposalView;