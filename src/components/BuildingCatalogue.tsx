import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';

interface Building {
  name: string;
  icon: string;
  description: string;
  cost: number;
  stats: {
    happiness: number;
    productivity: number;
    sustainability: number;
  };
}

const buildings: Building[] = [
  {
    name: 'Residential Complex',
    icon: '🏠',
    description: 'A modern housing facility for citizens',
    cost: 1000,
    stats: {
      happiness: 20,
      productivity: 10,
      sustainability: 15
    }
  },
  {
    name: 'Industrial Plant',
    icon: '🏭',
    description: 'A factory for producing goods',
    cost: 2000,
    stats: {
      happiness: 10,
      productivity: 25,
      sustainability: 25
    }
  },
  {
    name: 'Education Center',
    icon: '🏫',
    description: 'A school for learning and growth',
    cost: 1500,
    stats: {
      happiness: 15,
      productivity: 20,
      sustainability: 20
    }
  },
  {
    name: 'Medical Facility',
    icon: '🏥',
    description: 'A hospital for healthcare services',
    cost: 1800,
    stats: {
      happiness: 25,
      productivity: 15,
      sustainability: 20
    }
  }
];

const BuildingCatalogue = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        sx={{
          color: '#3affdd',
          fontFamily: 'Orbitron',
          fontSize: '1.5rem',
          mb: 3,
          textShadow: '0 0 10px rgba(58,255,221,0.5)'
        }}
      >
        Building Catalogue
      </Typography>

      <Grid container spacing={3}>
        {buildings.map((building) => (
          <Grid item xs={12} sm={6} md={3} key={building.name}>
            <Paper
              sx={{
                bgcolor: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(58,255,221,0.2)',
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 0 20px rgba(58,255,221,0.3)',
                  borderColor: '#3affdd'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '2rem', mr: 2 }}>{building.icon}</Typography>
                <Typography sx={{ 
                  color: '#3affdd',
                  fontFamily: 'Orbitron',
                  fontSize: '1.1rem'
                }}>
                  {building.name}
                </Typography>
              </Box>
              <Typography sx={{ color: 'white', mb: 2 }}>{building.description}</Typography>
              <Box sx={{ 
                bgcolor: 'rgba(58,255,221,0.1)',
                p: 1,
                borderRadius: '4px',
                mb: 2
              }}>
                <Typography sx={{ color: '#3affdd', fontFamily: 'Orbitron' }}>
                  Cost: {building.cost} GP
                </Typography>
              </Box>
              <Typography sx={{ color: 'white', fontSize: '0.8rem', mb: 2 }}>
                Happiness: {building.stats.happiness}% | Productivity: {building.stats.productivity}% |
                Sustainability: {building.stats.sustainability}%
              </Typography>
              <Button
                fullWidth
                sx={{
                  mt: 'auto',
                  bgcolor: 'rgba(58,255,221,0.1)',
                  color: '#3affdd',
                  border: '1px solid #3affdd',
                  fontFamily: 'Orbitron',
                  '&:hover': {
                    bgcolor: 'rgba(58,255,221,0.2)',
                  }
                }}
              >
                SELECT BUILDING
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BuildingCatalogue;
