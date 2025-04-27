import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Radio, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, IconButton, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ConstructionProject {
  id: number;
  name: string;
  duration: number;
  progress: number;
  priority: number;
  resources: number;
}

const buildings = [
  { id: 1, name: 'Residential Complex', cost: 1000 },
  { id: 2, name: 'Industrial Plant', cost: 2000 },
  { id: 3, name: 'Education Center', cost: 1500 },
  { id: 4, name: 'Medical Facility', cost: 1800 }
];

// Step Item Component - Moved outside main component
const StepItem = ({ label, isCompleted, isActive, step }: { 
  label: string; 
  isCompleted: boolean; 
  isActive: boolean;
  step: number;
}) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    mx: 4
  }}>
    <Box sx={{ 
      width: 40, 
      height: 40, 
      borderRadius: '50%',
      bgcolor: isCompleted ? '#3affdd' : isActive ? 'rgba(58,255,221,0.1)' : 'transparent',
      border: '1px solid',
      borderColor: isCompleted || isActive ? '#3affdd' : 'rgba(58,255,221,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 1,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      animation: isActive ? 'glowPulse 2s infinite' : 'none',
      color: isCompleted ? 'black' : '#3affdd',
      position: 'relative',
      '&::before': isCompleted ? {
        content: '""',
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '50%',
        border: '1px solid rgba(58,255,221,0.5)',
        animation: 'fadeIn 0.3s ease-out'
      } : {}
    }}>
      {isCompleted ? (
        <CheckCircleIcon sx={{ 
          transform: 'scale(1.2)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'fadeIn 0.3s ease-out'
        }} />
      ) : (
        <Typography sx={{ 
          fontSize: '1.2rem',
          fontWeight: 'bold',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isActive ? 1 : 0.7
        }}>
          {step}
        </Typography>
      )}
    </Box>
    <Typography sx={{ 
      color: isCompleted || isActive ? '#3affdd' : 'rgba(58,255,221,0.5)',
      fontFamily: 'Orbitron',
      fontSize: '0.9rem',
      textAlign: 'center',
      width: '120px',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isActive ? 1 : 0.7,
      transform: `translateY(${isActive ? '0' : '2px'})`,
      textShadow: isActive ? '0 0 8px rgba(58,255,221,0.5)' : 'none'
    }}>
      {label}
    </Typography>
  </Box>
);

const ConstructionPlanningPanel = () => {
  // All hooks declared at the top level
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintSuccess, setMintSuccess] = useState<boolean>(false);
  const [constructionQueue, setConstructionQueue] = useState<ConstructionProject[]>([
    { id: 1, name: 'Residential Complex A', duration: 30, progress: 0, priority: 1, resources: 1000 },
    { id: 2, name: 'Industrial Zone B', duration: 45, progress: 0, priority: 2, resources: 2000 },
    { id: 3, name: 'Education Center C', duration: 25, progress: 0, priority: 3, resources: 1500 }
  ]);

  const handleDelete = (id: number) => {
    setConstructionQueue(queue => queue.filter(project => project.id !== id));
  };

  const handleMovePriority = (id: number, direction: 'up' | 'down') => {
    const currentIndex = constructionQueue.findIndex(project => project.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === constructionQueue.length - 1)
    ) {
      return;
    }

    const newQueue = [...constructionQueue];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newQueue[currentIndex], newQueue[swapIndex]] = [newQueue[swapIndex], newQueue[currentIndex]];
    
    setConstructionQueue(newQueue);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleBuildingSelect = (buildingId: number) => {
    setSelectedBuilding(buildingId);
  };

  const handleMintNFT = async () => {
    try {
      setIsMinting(true);
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMintSuccess(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const renderStepContent = () => {
    const selectedBuildingData = buildings.find(b => b.id === selectedBuilding);

    switch (currentStep) {
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {buildings.map((building) => (
              <Box
                key={building.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid rgba(58,255,221,0.2)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(58,255,221,0.1)'
                  }
                }}
              >
                <Radio
                  checked={selectedBuilding === building.id}
                  onChange={() => handleBuildingSelect(building.id)}
                  sx={{
                    color: '#3affdd',
                    '&.Mui-checked': {
                      color: '#3affdd'
                    }
                  }}
                />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography sx={{ color: 'white', fontFamily: 'Orbitron' }}>
                    {building.name}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Cost: {building.cost} GP
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        );
      case 2:
        return selectedBuildingData ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 3,
            p: 2
          }}>
            <Typography
              sx={{
                color: '#3affdd',
                fontFamily: 'Orbitron',
                fontSize: '2rem',
                textAlign: 'center'
              }}
            >
              Mint StructureNFT
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ 
                color: 'white', 
                fontFamily: 'Orbitron',
                fontSize: '1.2rem',
                mb: 1
              }}>
                Building: {selectedBuildingData.name}
              </Typography>
              <Typography sx={{ 
                color: 'white',
                fontFamily: 'Orbitron',
                fontSize: '1.2rem'
              }}>
                Cost: {selectedBuildingData.cost} GP
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleMintNFT}
              disabled={isMinting}
              sx={{
                bgcolor: '#3affdd',
                color: 'black',
                py: 2,
                fontSize: '1.2rem',
                fontFamily: 'Orbitron',
                mt: 2,
                position: 'relative',
                '&:hover': {
                  bgcolor: 'rgba(58,255,221,0.8)'
                },
                '&::before': {
                  content: '"✓"',
                  marginRight: '8px'
                }
              }}
            >
              {isMinting ? 'MINTING...' : 'MINT NFT'}
            </Button>
          </Box>
        ) : null;
      case 3:
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            p: 2
          }}>
            <Typography
              sx={{
                color: '#3affdd',
                fontFamily: 'Orbitron',
                fontSize: '2rem',
                textAlign: 'center'
              }}
            >
              Success!
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              bgcolor: 'rgba(58,255,221,0.2)',
              border: '2px solid #3affdd'
            }}>
              <CheckCircleIcon sx={{ 
                fontSize: '40px', 
                color: '#3affdd',
                animation: 'fadeIn 0.5s ease-in'
              }} />
            </Box>
            <Typography sx={{ 
              color: 'white',
              fontFamily: 'Orbitron',
              fontSize: '1.2rem',
              textAlign: 'center'
            }}>
              Your StructureNFT has been minted successfully!
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        sx={{
          color: '#3affdd',
          fontFamily: 'Orbitron',
          fontSize: '2rem',
          mb: 4,
          textAlign: 'center',
          textShadow: '0 0 10px rgba(58,255,221,0.5)'
        }}
      >
        Construction Planning
      </Typography>

      {/* Steps Display */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 4,
        position: 'relative'
      }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '15%',
            right: '15%',
            height: '1px',
            backgroundColor: 'rgba(58,255,221,0.2)',
            transform: 'translateY(-50%)',
            zIndex: 0
          }
        }}>
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '15%',
            height: '1px',
            backgroundColor: '#3affdd',
            transform: 'translateY(-50%)',
            zIndex: 0,
            width: currentStep === 1 ? '0%' : 
                   currentStep === 2 ? '50%' : 
                   currentStep === 3 ? '100%' : '0%',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 8px rgba(58,255,221,0.5)',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#3affdd',
              boxShadow: '0 0 10px #3affdd',
              opacity: currentStep === 3 ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }
          }} />
          <StepItem
            label="Select a Building"
            isCompleted={currentStep > 1}
            isActive={currentStep === 1}
            step={1}
          />
          <StepItem
            label="Confirm Cost"
            isCompleted={currentStep > 2}
            isActive={currentStep === 2}
            step={2}
          />
          <StepItem
            label="Success"
            isCompleted={currentStep > 3}
            isActive={currentStep === 3}
            step={3}
          />
        </Box>
      </Box>

      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes glowPulse {
            0% { box-shadow: 0 0 5px rgba(58,255,221,0.5); }
            50% { box-shadow: 0 0 15px rgba(58,255,221,0.8); }
            100% { box-shadow: 0 0 5px rgba(58,255,221,0.5); }
          }
          @keyframes progressGlow {
            0% { box-shadow: 0 0 5px rgba(58,255,221,0.3); }
            50% { box-shadow: 0 0 10px rgba(58,255,221,0.6); }
            100% { box-shadow: 0 0 5px rgba(58,255,221,0.3); }
          }
        `}
      </style>

      {/* Content Area */}
      <Paper
        sx={{
          bgcolor: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(58,255,221,0.2)',
          p: 3,
          borderRadius: '8px'
        }}
      >
        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setShowQueue(true)}
            sx={{
              color: '#3affdd',
              borderColor: '#3affdd',
              '&:hover': {
                borderColor: '#3affdd',
                bgcolor: 'rgba(58,255,221,0.1)'
              }
            }}
          >
            View Queue
          </Button>
          <Box>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={currentStep === 1}
              sx={{
                color: '#3affdd',
                borderColor: '#3affdd',
                mr: 2,
                '&:hover': {
                  borderColor: '#3affdd',
                  bgcolor: 'rgba(58,255,221,0.1)'
                }
              }}
            >
              BACK
            </Button>
            {currentStep < 3 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedBuilding || currentStep === 3}
                sx={{
                  bgcolor: '#3affdd',
                  color: 'black',
                  '&:hover': {
                    bgcolor: 'rgba(58,255,221,0.8)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(58,255,221,0.1)',
                    color: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                {currentStep === 2 ? 'FINISH' : 'NEXT'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Queue Dialog */}
      <Dialog
        open={showQueue}
        onClose={() => setShowQueue(false)}
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
        <DialogTitle sx={{ 
          color: '#3affdd',
          fontFamily: 'Orbitron',
          borderBottom: '1px solid rgba(58,255,221,0.2)'
        }}>
          Construction Queue
        </DialogTitle>
        <DialogContent>
          <List>
            {constructionQueue.map((project, index) => (
              <ListItem
                key={project.id}
                sx={{
                  bgcolor: 'rgba(58,255,221,0.1)',
                  mb: 1,
                  borderRadius: '4px',
                  '&:hover': {
                    bgcolor: 'rgba(58,255,221,0.2)',
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ color: 'white', fontFamily: 'Orbitron' }}>
                      {project.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                        Resources: {project.resources} GP | Duration: {project.duration} days
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          mt: 1,
                          bgcolor: 'rgba(58,255,221,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#3affdd'
                          }
                        }}
                      />
                    </Box>
                  }
                />
                <IconButton
                  onClick={() => handleMovePriority(project.id, 'up')}
                  disabled={index === 0}
                  sx={{ color: '#3affdd' }}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleMovePriority(project.id, 'down')}
                  disabled={index === constructionQueue.length - 1}
                  sx={{ color: '#3affdd' }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(project.id)}
                  sx={{ color: '#ff3a3a' }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ConstructionPlanningPanel;
