import React, { useState } from 'react';
import { useDaoGovernance } from '../hooks/useDaoGovernance';
import { useGovernanceAnalysis } from '../hooks/useGovernanceAnalysis';
import { Proposal, ProposalAnalysis } from '../hooks/useGovernanceAnalysis';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip
} from '@mui/material';

const GovernanceDashboard: React.FC = () => {
  const {
    daoState,
    proposals,
    loading: daoLoading,
    createProposal: createDaoProposal,
    voteOnProposal,
    executeProposal,
    getProposalStatus
  } = useDaoGovernance();

  const {
    analysis,
    loading: analysisLoading,
    error: analysisError,
    createProposal,
    analyzeProposal
  } = useGovernanceAnalysis();

  const [newProposal, setNewProposal] = useState<Omit<Proposal, 'status' | 'createdAt'>>({
    title: '',
    description: '',
    category: 'infrastructure',
    budget: 0,
    timeline: {
      start: new Date(),
      end: new Date()
    },
    creator: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleCreateProposal = async () => {
    try {
      setError(null);
      
      // First create the base proposal
      const proposal = createProposal(newProposal);
      
      // Analyze the proposal and get the analysis
      const proposalAnalysis = await analyzeProposal(proposal);
      
      // Create the DAO proposal with analysis
      await createDaoProposal(newProposal, proposalAnalysis);
      
      // Reset form
      setNewProposal({
        title: '',
        description: '',
        category: 'infrastructure',
        budget: 0,
        timeline: {
          start: new Date(),
          end: new Date()
        },
        creator: ''
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      setError('Failed to create proposal. Please try again.');
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    try {
      await voteOnProposal(proposalId, vote, 1);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }} className="cyberpunk-scrollbar">
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          color: '#3affdd',
          fontFamily: 'Orbitron',
          textShadow: '0 0 10px rgba(58,255,221,0.5)',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}
      >
        DAO Governance Dashboard
      </Typography>

      {/* Create Proposal Form */}
      <Card className="cyberpunk-card" sx={{ mb: 3 }}>
        <CardContent>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#3affdd',
              fontFamily: 'Orbitron',
              textShadow: '0 0 5px rgba(58,255,221,0.3)'
            }}
          >
            Create New Proposal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newProposal.title}
                onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                className="cyberpunk-input"
                InputLabelProps={{
                  sx: { color: '#3affdd' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={newProposal.description}
                onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                className="cyberpunk-input"
                InputLabelProps={{
                  sx: { color: '#3affdd' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#3affdd' }}>Category</InputLabel>
                <Select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value as any })}
                  className="cyberpunk-select"
                  sx={{ color: '#fff' }}
                >
                  <MenuItem value="infrastructure">Infrastructure</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                  <MenuItem value="environmental">Environmental</MenuItem>
                  <MenuItem value="economic">Economic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Budget"
                value={newProposal.budget}
                onChange={(e) => setNewProposal({ ...newProposal, budget: Number(e.target.value) })}
                className="cyberpunk-input"
                InputLabelProps={{
                  sx: { color: '#3affdd' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleCreateProposal}
                disabled={daoLoading || analysisLoading}
                className="cyberpunk-button"
              >
                Create Proposal
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {(error || analysisError) && (
        <Card className="cyberpunk-card" sx={{ mb: 3, borderColor: 'rgba(255,0,0,0.5)' }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#ff3a3a',
                fontFamily: 'Orbitron',
                textShadow: '0 0 5px rgba(255,58,58,0.5)'
              }}
            >
              Error
            </Typography>
            <Typography sx={{ color: '#ff3a3a' }}>
              {error || analysisError}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Proposals List */}
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          color: '#3affdd',
          fontFamily: 'Orbitron',
          textShadow: '0 0 5px rgba(58,255,221,0.3)'
        }}
      >
        Active Proposals
      </Typography>

      {/* Analysis Results */}
      {analysis && (
        <Card className="cyberpunk-card" sx={{ mb: 3 }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#3affdd',
                fontFamily: 'Orbitron',
                textShadow: '0 0 5px rgba(58,255,221,0.3)'
              }}
            >
              Proposal Analysis
            </Typography>
            
            <Grid container spacing={2}>
              {/* Impact Analysis */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#3affdd' }}>Impact Analysis</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant="body2">Economic: {analysis.impactAnalysis.economic}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.impactAnalysis.economic} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">Social: {analysis.impactAnalysis.social}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.impactAnalysis.social} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">Environmental: {analysis.impactAnalysis.environmental}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.impactAnalysis.environmental} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">Infrastructure: {analysis.impactAnalysis.infrastructure}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.impactAnalysis.infrastructure} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Citizen Sentiment */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#3affdd' }}>Citizen Sentiment</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="body2">Positive: {analysis.citizenSentiment.positive}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.citizenSentiment.positive} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Neutral: {analysis.citizenSentiment.neutral}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.citizenSentiment.neutral} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Negative: {analysis.citizenSentiment.negative}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.citizenSentiment.negative} 
                      sx={{ 
                        height: 8,
                        backgroundColor: 'rgba(58,255,221,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3affdd'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Key Insights */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#3affdd' }}>Key Insights</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysis.keyInsights.map((insight, index) => (
                    <Chip
                      key={index}
                      label={insight}
                      className="cyberpunk-chip"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Recommendations */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#3affdd' }}>Recommendations</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysis.recommendations.map((recommendation, index) => (
                    <Chip
                      key={index}
                      label={recommendation}
                      className="cyberpunk-chip"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Risk Assessment */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#3affdd' }}>Risk Assessment</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Risk Level: <Chip 
                    label={analysis.riskAssessment.level.toUpperCase()} 
                    className="cyberpunk-chip"
                    sx={{ 
                      backgroundColor: analysis.riskAssessment.level === 'high' ? 'rgba(255,0,0,0.2)' : 
                                    analysis.riskAssessment.level === 'medium' ? 'rgba(255,165,0,0.2)' : 
                                    'rgba(0,255,0,0.2)'
                    }}
                  />
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#3affdd' }}>Risk Factors</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {analysis.riskAssessment.factors.map((factor, index) => (
                    <Chip
                      key={index}
                      label={factor}
                      className="cyberpunk-chip"
                    />
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ color: '#3affdd' }}>Mitigation Strategies</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysis.riskAssessment.mitigationStrategies.map((strategy, index) => (
                    <Chip
                      key={index}
                      label={strategy}
                      className="cyberpunk-chip"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3} className="cyberpunk-grid">
        {proposals.map((proposal) => (
          <Grid item xs={12} key={proposal.proposalId}>
            <Card className="cyberpunk-card">
              <CardContent>
                <Typography 
                  variant="h6"
                  sx={{
                    color: '#3affdd',
                    fontFamily: 'Orbitron',
                    textShadow: '0 0 5px rgba(58,255,221,0.3)'
                  }}
                >
                  {proposal.title}
                </Typography>
                <Typography 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ color: '#fff' }}
                >
                  {proposal.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={proposal.category} 
                    sx={{ mr: 1 }} 
                    className="cyberpunk-chip"
                  />
                  <Chip 
                    label={getProposalStatus(proposal)} 
                    color="primary" 
                    className="cyberpunk-chip"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2"
                    sx={{ color: '#fff' }}
                  >
                    Votes For: {proposal.votes.for} | Against: {proposal.votes.against} | Abstain: {proposal.votes.abstain}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleVote(proposal.proposalId, 'for')}
                    className="cyberpunk-button"
                  >
                    Vote For
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleVote(proposal.proposalId, 'against')}
                    className="cyberpunk-button"
                  >
                    Vote Against
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleVote(proposal.proposalId, 'abstain')}
                    className="cyberpunk-button"
                  >
                    Abstain
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Loading States */}
      {(daoLoading || analysisLoading) && (
        <Box sx={{ width: '100%', mt: 2 }} className="cyberpunk-progress">
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
};

export default GovernanceDashboard; 