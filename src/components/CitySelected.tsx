import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, LinearProgress, Fab, Zoom, Grid, Button, TextField, IconButton } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WarningIcon from '@mui/icons-material/Warning';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SendIcon from '@mui/icons-material/Send';
import { getGameExplanation, generateCrisisAndProposals } from '../hooks/useGroq';
import { useFluvioChat } from '../hooks/useFluvio';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { SvgIconProps } from '@mui/material';
// Define the metrics type for TypeScript safety
type MetricKey = 'water' | 'pollution' | 'energy' | 'health';

const metricIcons: Record<MetricKey, React.ElementType> = {
  water: WaterDropIcon,
  pollution: WarningIcon,
  energy: FlashOnIcon,
  health: FavoriteIcon,
};

const metricColors: Record<MetricKey, string> = {
  water: '#3affdd',
  pollution: '#ff00ff',
  energy: '#0077ff',
  health: '#00ff00',
};

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface Resources {
  water: number;
  pollution: number;
  energy: number;
  health: number;
}

interface City {
  id: number;
  name: string;
  image: string;
  resources: Resources;
}

interface CrisisResponse {
  crisis: string;
  proposals: string[];
}

interface CitySelectedProps {
  selectedCity: City;
}

const CitySelected: React.FC<CitySelectedProps> = ({ selectedCity }) => {
  const [gameExplanation, setGameExplanation] = useState<string>('');
  const [crisis, setCrisis] = useState<string>('');
  const [proposals, setProposals] = useState<string[]>([]);
  const { messages, sendMessage } = useFluvioChat(selectedCity.id);
  const [chatInput, setChatInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setShowScrollTop(scrollTop > 300);
      }
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const imageUrl = '/images/cities/' + selectedCity.id + '.jpg';
        const explanation = await getGameExplanation(imageUrl);
        setGameExplanation(explanation);

        const response: CrisisResponse = await generateCrisisAndProposals(
          selectedCity.name, 
          selectedCity.resources
        );
        
        setCrisis(response.crisis);
        setProposals(response.proposals);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setCrisis("Error loading crisis data");
        setProposals(["Please try again later"]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCity.id, selectedCity.name, selectedCity.resources]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  const handleProposalClick = (index: number) => {
    // Navigate to the combined governance-construction view
    navigate('/governance-construction', {
      state: {
        proposalId: index,
        cityId: selectedCity.id
      }
    });
  };

  const renderMetrics = () => {
    const metrics: MetricKey[] = ['water', 'pollution', 'energy', 'health'];
    
    return metrics.map((metric) => {
      const Icon = metricIcons[metric];
      return (
        <Box key={metric} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 1.5 // Reduced margin bottom
        }}>
          {/* @ts-ignore */}
          <Icon sx={{ color: metricColors[metric], fontSize: 20 } as any} /> {/* Reduced icon size */}
          <LinearProgress
            variant="determinate"
            value={selectedCity.resources[metric]}
            sx={{ 
              flex: 1, 
              '& .MuiLinearProgress-bar': { 
                bgcolor: metricColors[metric],
                transition: 'transform 0.5s ease'
              }, 
              bgcolor: 'rgba(255,255,255,0.1)',
              height: 8, // Reduced height
              borderRadius: 4
            }}
          />
          <Typography sx={{ 
            color: '#fff', 
            minWidth: '45px', 
            textAlign: 'right',
            fontSize: '0.9rem' // Reduced font size
          }}>
            {selectedCity.resources[metric]}%
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Box className="city-selected" sx={{ height: '100vh', bgcolor: '#0a0a2a' }}>
      {/* City Header */}
      <Box className="header-bar" sx={{ 
        p: 2, 
        bgcolor: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(58,255,221,0.2)'
      }}>
        <Typography 
            sx={{ 
            fontFamily: 'Orbitron',
            fontSize: '2rem',
            color: '#3affdd'
          }}
        >
          {selectedCity.name}
        </Typography>
        <Typography 
            sx={{ 
            color: messages.length > 0 ? '#00ff00' : '#3affdd',
            fontFamily: 'Orbitron',
            opacity: messages.length > 0 ? 1 : 0.7
          }}
        >
          Fluvio Status: {messages.length > 0 ? 'Connected' : 'Connecting...'}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        p: 2, 
        height: 'calc(100vh - 80px)',
        display: 'grid',
        gridTemplateColumns: '300px 1fr 330px',
        gap: 2
      }}>
        {/* Metrics Panel */}
        <Paper sx={{ 
          bgcolor: 'rgba(0,0,0,0.6)',
          borderRadius: '8px',
          p: 2,
          border: '1px solid rgba(58,255,221,0.2)',
          height: '590px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {renderMetrics()}
        </Paper>

        {/* Middle Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Crisis Panel */}
          <Paper sx={{ 
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '8px',
            p: 2,
            border: '1px solid rgba(58,255,221,0.2)',
            height: '290px',
            overflow: 'auto'
          }}>
            <Typography 
              sx={{ 
                color: '#3affdd',
                fontFamily: 'Orbitron',
                fontSize: '1.2rem',
                mb: 1
              }}
            >
              CRISIS
            </Typography>
            <Typography sx={{ 
              color: '#ff0000',
              fontFamily: 'Orbitron',
              fontSize: '0.9rem',
              lineHeight: 1.4
            }}>
              {crisis}
            </Typography>
          </Paper>

          {/* Proposals Panel */}
          <Paper sx={{ 
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '8px',
            p: 2,
            border: '1px solid rgba(58,255,221,0.2)',
            height: '290px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography 
              sx={{ 
                color: '#3affdd',
                fontFamily: 'Orbitron',
                fontSize: '1.2rem',
                mb: 2
              }}
            >
              PROPOSALS
            </Typography>
            <Box sx={{ 
              overflowY: 'auto',
              flex: 1,
              pr: 1,
              mr: -1,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#3affdd',
                borderRadius: '4px',
              }
            }}>
              {proposals.map((proposal, index) => (
                <Paper 
                  key={index} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    bgcolor: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(58,255,221,0.2)',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(58,255,221,0.1)',
                      borderColor: 'rgba(58,255,221,0.5)',
                    },
                    '&:last-child': {
                      mb: 0
                    }
                  }}
                  onClick={() => handleProposalClick(index)}
                >
                  <Typography sx={{ 
                    color: 'white',
                    fontFamily: 'Orbitron',
                    fontSize: '0.9rem'
                  }}>
                    {proposal}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* City Map */}
          <Paper sx={{ 
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '8px',
            p: 2,
            border: '1px solid rgba(58,255,221,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <Box 
              component="img"
              src="/path/to/city-icon.png"
              sx={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid rgba(58,255,221,0.5)'
              }}
            />
          </Paper>

          {/* Townhall Chat */}
          <Paper sx={{ 
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '8px',
            p: 2,
            border: '1px solid rgba(58,255,221,0.2)',
            height: '350px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography 
              sx={{ 
                color: '#3affdd',
                fontFamily: 'Orbitron',
                fontSize: '1.2rem',
                mb: 2
              }}
            >
              TOWNHALL CHAT
            </Typography>
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              mb: 2,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#3affdd',
                borderRadius: '4px',
              }
            }}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      border: '1px solid rgba(58,255,221,0.1)'
                    }}
                  >
                    <Typography sx={{ 
                      color: '#3affdd',
                      fontFamily: 'Orbitron',
                      fontSize: '0.8rem',
                      mb: 0.5
                    }}>
                      {message.sender}
                    </Typography>
                    <Typography sx={{ 
                      color: 'white',
                      fontFamily: 'Orbitron',
                      fontSize: '0.9rem'
                    }}>
                      {message.content}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ 
                  color: '#3affdd',
                  fontFamily: 'Orbitron',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  opacity: 0.7
                }}>
                  No messages yet. Start the conversation!
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              display: 'flex',
              gap: 1,
              width: '100%'
            }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    fontSize: '0.9rem',
                    height: '36px',
                    '& fieldset': { 
                      borderColor: '#3affdd',
                      borderRadius: '4px'
                    },
                    '&:hover fieldset': { 
                      borderColor: '#3affdd' 
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3affdd'
                    },
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    '&:hover, &.Mui-focused': {
                      backgroundColor: 'rgba(0,0,0,0.3)'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    '&::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                      opacity: 1
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                sx={{ 
                  bgcolor: '#3affdd',
                  color: 'black',
                  fontFamily: 'Orbitron',
                  '&:hover': {
                    bgcolor: '#2de0c4'
                  },
                  minWidth: '60px',
                  height: '36px',
                  fontSize: '0.9rem'
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CitySelected;