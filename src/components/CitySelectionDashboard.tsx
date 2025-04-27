import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './CitySelectionDashboard.css';

interface CityData {
  id: number;
  name: string;
  image: string;
  population: string;
  resources: number;
  health: number;
  description: string;
  color: string;
  longDescription: string;
  features: string[];
  challenges: string[];
}

const cities: CityData[] = [
  {
    id: 1,
    name: "Neo Tokyo",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    population: "8.5M",
    resources: 35,
    health: 45,
    description: "A city in crisis, struggling with resource depletion",
    color: "#ff4444",
    longDescription: "Neo Tokyo faces severe challenges: pollution levels are critical, infrastructure is crumbling, and citizen morale is at an all-time low. The city desperately needs strong leadership to reverse its decline.",
    features: ["Crumbling Infrastructure", "Polluted Environment", "Low Morale"],
    challenges: ["Resource Scarcity", "Environmental Crisis", "Social Unrest"]
  },
  {
    id: 2,
    name: "Quantum Valley",
    image: "https://images.unsplash.com/photo-1516321310764-8d0b6520d83a",
    population: "5.2M",
    resources: 65,
    health: 70,
    description: "A city maintaining stability",
    color: "#ffbb33",
    longDescription: "Quantum Valley is holding steady but faces challenges. While basic services are functioning, the city needs strategic improvements to reach its full potential.",
    features: ["Stable Infrastructure", "Moderate Resources", "Balanced Economy"],
    challenges: ["Resource Management", "Urban Planning", "Growth Strategy"]
  },
  {
    id: 3,
    name: "Eden Prime",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    population: "3.8M",
    resources: 90,
    health: 95,
    description: "A thriving metropolis of sustainability",
    color: "#00ff9d",
    longDescription: "Eden Prime is a model of sustainable development. With advanced green technology and efficient resource management, the city is a beacon of hope for urban development.",
    features: ["Green Technology", "Sustainable Infrastructure", "High Citizen Satisfaction"],
    challenges: ["Maintaining Growth", "Innovation", "Expansion Planning"]
  }
];

const CitySelectionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setTimeout(() => navigate('/city-selected', { state: { city } }), 800);
  };

  const sidebarVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20, delay: i * 0.1 }
    }),
    hover: {
      y: -5,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  return (
    <Box className="city-selection-dashboard">
      <motion.div
        className="sidebar"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <Tooltip title="Dashboard" placement="right">
          <IconButton className="sidebar-icon active">
            <DashboardIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Metrics" placement="right">
          <IconButton className="sidebar-icon">
            <BarChartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Governance" placement="right">
          <IconButton className="sidebar-icon">
            <GavelIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Crisis" placement="right">
          <IconButton className="sidebar-icon">
            <WarningIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Economy" placement="right">
          <IconButton className="sidebar-icon">
            <AccountBalanceIcon />
          </IconButton>
        </Tooltip>
      </motion.div>


        <Typography 
          className="dashboard-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          component={motion.p}
        >
          Select Your City
        </Typography>

        <Box className="city-grid">
          <AnimatePresence>
            {cities.map((city, index) => (
              <motion.div
                key={city.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`city-card ${selectedCity?.id === city.id ? 'selected' : ''}`}
                onClick={() => handleCitySelect(city)}
                onMouseEnter={() => setHoveredCard(city.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className="card-flipper"
                  animate={{ rotateY: hoveredCard === city.id ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <Paper className="city-card-content card-front">
                    <div 
                      className="city-image" 
                      style={{ backgroundImage: `url(${city.image})` }} 
                    />
                    <Box className="city-info">
                      <div>
                        <Typography className="city-name" style={{ color: city.color }}>
                          {city.name}
                        </Typography>
                        <Typography className="city-description">
                          {city.description}
                        </Typography>
                      </div>
                      <Box className="city-metrics">
                        <motion.div className="metric" whileHover={{ scale: 1.05 }}>
                          <span className="label">Pop</span>
                          <span className="value">{city.population}</span>
                        </motion.div>
                        <motion.div className="metric" whileHover={{ scale: 1.05 }}>
                          <span className="label">Res</span>
                          <span className="value">{city.resources}%</span>
                        </motion.div>
                        <motion.div className="metric" whileHover={{ scale: 1.05 }}>
                          <span className="label">Health</span>
                          <span className="value">{city.health}%</span>
                        </motion.div>
                      </Box>
                    </Box>
                  </Paper>

                  <Paper className="city-card-content card-back">
                    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ mb: 2, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {city.longDescription}
                      </Typography>
                      <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {city.features.map((feature, i) => (
                            <motion.div
                              key={i}
                              className="feature-tag"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {feature}
                            </motion.div>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {city.challenges.map((challenge, i) => (
                            <motion.div
                              key={i}
                              className="challenge-tag"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {challenge}
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

    </Box>
  );
};

export default CitySelectionDashboard;
