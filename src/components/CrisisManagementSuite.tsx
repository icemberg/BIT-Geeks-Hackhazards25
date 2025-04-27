import React, { useState } from 'react';
import { ChakraProvider, Container, VStack, Box, Button } from '@chakra-ui/react';
import CrisisDashboard from './CrisisDashboard';
import ActionPlan from './ActionPlan';
import CollaborationTracker from './CollaborationTracker';
import CrisisMetricsPanel from './CrisisMetricsPanel';
import { CrisisData } from '../types/ai';
import { system } from '../theme';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/crisis-dashboard.css';

function CrisisManagementSuite() {
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisData | undefined>(undefined);
  const navigate = useNavigate();

  const handleCrisisSelect = (crisis: CrisisData) => {
    setSelectedCrisis(crisis);
  };

  const handleNavigateToCommunication = () => {
    navigate('/communication');
  };

  return (
    <ChakraProvider value={system}>
      <div
        className="crisis-dashboard-theme"
        style={{
          height: '100vh',
          overflow: 'hidden',
          width: '100vw',
          background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
          padding: '2rem 0',
          position: 'relative',
        }}
      >
        <Container maxW="container.xl" py={8} h="100%">
          <VStack
            gap={8}
            align="stretch"
            h="calc(100vh - 6rem)"
            overflowY="auto"
            pr={2}
          >
            <CrisisDashboard onCrisisSelect={handleCrisisSelect} />
            <ActionPlan 
              crisisId={selectedCrisis?.crisisType || '1'} 
              onActionComplete={() => {}} 
              crisisData={selectedCrisis}
            />
            <CollaborationTracker
              teamMembers={[
                { name: 'John Doe', role: 'Coordinator', avatar: '' },
                { name: 'Jane Smith', role: 'Responder', avatar: '' },
              ]}
              progress={75}
              tasks={[
                { title: 'Task 1', status: 'completed' },
                { title: 'Task 2', status: 'in-progress' },
                { title: 'Task 3', status: 'pending' },
              ]}
            />
            <Box pr={{ base: 0, md: 8 }}>
              <CrisisMetricsPanel />
            </Box>
          </VStack>
        </Container>

        {/* Communication Dashboard Navigation Button */}
        <Box
          position="fixed"
          bottom="30px"
          right="30px"
          zIndex={100}
        >
          <Button
            onClick={handleNavigateToCommunication}
            colorScheme="cyan"
            size="lg"
            borderRadius="full"
            px={6}
            py={6}
            boxShadow="0 0 15px rgba(0, 255, 255, 0.5)"
            _hover={{
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.7)",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Communication Dashboard</span>
              <FaArrowRight style={{ marginLeft: '8px' }} />
            </div>
          </Button>
        </Box>
      </div>
    </ChakraProvider>
  );
}

export default CrisisManagementSuite; 