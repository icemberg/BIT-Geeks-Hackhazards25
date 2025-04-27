import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './CityEntrance.css';

const CityEntrance: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector('.city-entrance')?.classList.add('animate-in');
  }, []);

  const handleEnterCity = () => {
    document.querySelector('.city-entrance')?.classList.add('animate-out');
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <div className="city-entrance">
      <div className="city-background">
        <div className="stars"></div>
        <div className="city-skyline">
          {/* Animated Buildings */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className={`building building-${index + 1}`}>
              <div className="windows">
                {[...Array(12)].map((_, windowIndex) => (
                  <div key={windowIndex} className="window"></div>
                ))}
              </div>
              <div className="antenna"></div>
              <div className="glow"></div>
            </div>
          ))}
          
          {/* Floating Elements */}
          <div className="floating-platforms">
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`platform platform-${index + 1}`}>
                <div className="platform-light"></div>
              </div>
            ))}
          </div>
          
          {/* Animated Vehicles */}
          <div className="flying-vehicles">
            {[...Array(5)].map((_, index) => (
              <div key={index} className={`vehicle vehicle-${index + 1}`}>
                <div className="vehicle-light"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Flow Lines */}
        <div className="energy-flows">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={`energy-line flow-${index + 1}`}></div>
          ))}
        </div>
      </div>

      <Box className="content" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="h1" 
          className="title animate-text"
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            fontWeight: '700',
            letterSpacing: '0.2em',
            color: '#06b6d4',
            textShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)',
            marginBottom: '0.5rem',
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          CIVIC QUEST
        </Typography>
        
        <Typography 
          variant="h2" 
          className="subtitle animate-text"
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            letterSpacing: '0.5em',
            color: '#06b6d4',
            opacity: 0.8,
            marginBottom: '3rem',
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          REBUILD THE FUTURE
        </Typography>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon className="arrow-icon" />}
          onClick={handleEnterCity}
          className="enter-button pulse-animation"
          sx={{
            background: 'linear-gradient(45deg, #06b6d4 30%, #0891b2 90%)',
            padding: '15px 40px',
            fontSize: '1.5rem',
            borderRadius: '12px',
            textTransform: 'none',
            border: '2px solid rgba(6, 182, 212, 0.5)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            fontFamily: "'Orbitron', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              background: 'linear-gradient(45deg, #0891b2 30%, #0e7490 90%)',
              transform: 'scale(1.05)',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)',
              '& .arrow-icon': {
                transform: 'translateX(5px)',
              }
            },
            '& .arrow-icon': {
              transition: 'transform 0.3s ease',
            },
            transition: 'all 0.3s ease',
          }}
        >
          DIVE IN
        </Button>
      </Box>
    </div>
  );
};

export default CityEntrance; 