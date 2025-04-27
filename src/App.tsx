import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import OnboardingDashboard from './components/OnboardingDashboard';
import CityEntrance from './components/CityEntrance';
import CitySelectionDashboard from './components/CitySelectionDashboard';
import CitySelected from './components/CitySelected';
import CustomCursor from './components/CustomCursor';
import './App.css';
import React, { useEffect, useState } from 'react';
import ProposalBoard from './components/ProposalBoard';
import DetailedProposalView, { Proposal } from './components/DetailedProposalView';
import ConstructionPlanningPanel from './components/ConstructionPlanningPanel';
import ConstructionProgressTracker from './components/ConstructionProgressTracker';
import BuildingCatalogue from './components/BuildingCatalogue';
import DAOParticipationStatus from './components/DAOParticipationStatus';
import ProgressTracker from './components/ProgressTracker';
import GovernanceConstructionPanel from './components/GovernanceConstructionPanel';
import CommunicationDashboard from './components/CommunicationDashboard';
import CrisisManagementSuite from './components/CrisisManagementSuite';
import RewardsIntegrationDashboard from './components/RewardsIntegrationDashboard';

interface MockProposal {
  id: number;
  title: string;
  description: string;
  voteCounts: {
    yes: number;
    no: number;
    abstain: number;
  };
  aiAnalysis: string;
  joke: string;
}

const mockProposals: MockProposal[] = [
  {
    id: 1,
    title: 'Community Park Renovation',
    description: 'This proposal aims to renovate the local community park, including new playground equipment, landscaping, and accessibility improvements.',
    voteCounts: { yes: 120, no: 30, abstain: 50 },
    aiAnalysis: 'The renovation is likely to increase community happiness by 15% and improve local environment sustainability.',
    joke: "Why don't parks ever get lonely? Because they're always full of trees! 🌳",
  },
  {
    id: 2,
    title: 'Public Transportation Expansion',
    description: 'This proposal seeks to expand the public transportation system by adding new bus routes and increasing service frequency.',
    voteCounts: { yes: 80, no: 60, abstain: 40 },
    aiAnalysis: 'Expansion may reduce traffic congestion by 10% and improve air quality by decreasing car dependency.',
    joke: 'Why did the bus break up with the car? It needed more space! 🚌',
  },
];

// Define the City interface based on what CitySelected expects
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

const theme = createTheme({
  palette: {
    primary: {
      main: '#00ff9d', // Updated to match our new color scheme
    },
    secondary: {
      main: '#00b8ff', // Updated to match our new color scheme
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 'bold',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #00ff9d, #00b8ff)',
          color: '#000000',
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 255, 157, 0.3)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          height: '100vh',
          width: '100vw',
          padding: '0 !important',
          margin: '0 !important',
          maxWidth: '100% !important',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    // Remove MuiBox override and use sx prop instead
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          background: 'linear-gradient(90deg, #00ff9d, #00b8ff)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#00ff9d',
        },
      },
    },
  },
  typography: {
    fontFamily: "'Orbitron', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          color: 'white', 
          background: 'rgba(0,0,0,0.8)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1>Something went wrong</h1>
          <pre style={{ 
            maxWidth: '80%', 
            overflow: 'auto', 
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '8px'
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to handle city selection state
const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Default city data if none is selected
  const defaultCity: City = {
    id: 1,
    name: "Neo Tokyo",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    resources: {
      water: 50,
      pollution: 70,
      energy: 40,
      health: 45
    }
  };

  // Check if a city was passed via location state
  const locationState = location.state as { city?: any } | undefined;
  const selectedCity = locationState?.city ? {
    id: locationState.city.id,
    name: locationState.city.name,
    image: locationState.city.image,
    resources: {
      water: locationState.city.resources || 50,
      pollution: locationState.city.health || 50,
      energy: locationState.city.resources || 50,
      health: locationState.city.health || 50
    }
  } : defaultCity;

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const handleProposalSelect = (id: number) => {
    const proposal = mockProposals.find((p: MockProposal) => p.id === id);
    if (proposal) {
      setSelectedProposal({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        votes: {
          for: proposal.voteCounts.yes,
          against: proposal.voteCounts.no
        },
        status: 'active',
        totalVotes: proposal.voteCounts.yes + proposal.voteCounts.no + proposal.voteCounts.abstain
      });
      navigate(`/proposals/${id}`);
    }
  };

  const handleProposalClose = () => {
    setSelectedProposal(null);
    navigate('/proposals');
  };

  return (
    <div className="App">
      <div className="game-container">
        <Routes>
          <Route path="/" element={<CityEntrance />} />
          <Route path="/onboarding" element={<OnboardingDashboard />} />
          <Route path="/city-selection" element={<CitySelectionDashboard />} />
          <Route path="/city-selected" element={<CitySelected selectedCity={selectedCity} />} />
          <Route path="/governance-construction" element={<GovernanceConstructionPanel />} />
          <Route path="/communication" element={<CommunicationDashboard />} />
          <Route path="/crisis-management" element={<CrisisManagementSuite />} />
          <Route path="/rewards" element={<RewardsIntegrationDashboard />} />
          <Route 
            path="/proposals" 
            element={
              <ProposalBoard 
                onSelectProposal={handleProposalSelect} 
                isWalletConnected={false} 
              />
            } 
          />
          <Route 
            path="/proposals/:id" 
            element={
              selectedProposal ? (
                <DetailedProposalView 
                  proposal={selectedProposal} 
                  onClose={handleProposalClose} 
                />
              ) : null
            } 
          />
          <Route path="/construction" element={<ConstructionPlanningPanel />} />
          <Route path="/construction/progress" element={<ConstructionProgressTracker />} />
          <Route path="/buildings" element={<BuildingCatalogue />} />
          <Route path="/dao" element={<DAOParticipationStatus />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/proposal-board" element={<ProposalBoard />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CustomCursor />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;