import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Stack,
  Text,
  Badge,
  Button,
} from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { Progress } from '@chakra-ui/progress';
import { useToast } from '@chakra-ui/toast';
import { Crisis, CrisisSeverity, CrisisType } from '../types/crisis';
import { CrisisData } from '../types/ai';
import { FaExclamationTriangle, FaChartLine, FaUsers } from 'react-icons/fa';
import { WalletManager } from '../web3/wallet';
import { CrisisContract } from '../web3/contract';

const walletManager = new WalletManager();

interface CrisisDashboardProps {
  onCrisisSelect: (crisis: CrisisData) => void;
}

const CrisisDashboard: React.FC<CrisisDashboardProps> = ({ onCrisisSelect }) => {
  const [activeCrises, setActiveCrises] = useState<Crisis[]>([]);
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<CrisisContract | null>(null);
  const toast = useToast();

  useEffect(() => {
    const init = async () => {
      if (walletManager.isConnected()) {
        const provider = walletManager.getProvider();
        if (provider) {
          setContract(new CrisisContract(provider));
          setIsConnected(true);
        }
      }
    };
    init();
  }, []);

  const handleConnectWallet = async () => {
    try {
      await walletManager.connect();
      const provider = walletManager.getProvider();
      if (provider) {
        setContract(new CrisisContract(provider));
        setIsConnected(true);
        toast({
          title: 'Wallet Connected',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error connecting wallet',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDeclareCrisis = async () => {
    if (!contract) return;
    
    try {
      const txHash = await contract.declareCrisis(
        selectedCrisis?.type || 'environmental',
        selectedCrisis?.description || 'New crisis declared'
      );
      
      toast({
        title: 'Crisis Declared',
        description: `Transaction Hash: ${txHash}`,
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Error declaring crisis',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRespondToCrisis = async (points: number) => {
    if (!contract || !selectedCrisis) return;
    
    try {
      await contract.respondToCrisis(Number(selectedCrisis.id), points);
      toast({
        title: 'Response Submitted',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error submitting response',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis);
    onCrisisSelect({
      crisisType: crisis.type,
      description: crisis.description,
      location: 'District 3', // This should come from the crisis data
      affectedPopulation: 1000, // This should come from the crisis data
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    setActiveCrises([
      {
        id: '1',
        title: 'Air Quality Emergency',
        description: 'Severe pollution levels detected in District 3',
        severity: 'critical',
        type: 'environmental',
        affectedMetrics: ['pollution', 'health'],
        startTime: new Date(),
        status: 'active',
        progress: 45,
        requiredActions: ['Deploy air filters', 'Evacuate vulnerable populations'],
        currentActions: ['Deploying air filters'],
        participants: ['User1', 'User2'],
      },
      {
        id: '2',
        title: 'Power Grid Instability',
        description: 'Intermittent power outages reported',
        severity: 'high',
        type: 'infrastructure',
        affectedMetrics: ['morale', 'health'],
        startTime: new Date(),
        status: 'active',
        progress: 30,
        requiredActions: ['Dispatch repair teams', 'Activate backup generators'],
        currentActions: ['Repair teams en route'],
        participants: ['User3', 'User4'],
      },
    ]);
  }, []);

  const getSeverityColor = (severity: CrisisSeverity) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: CrisisType) => {
    switch (type) {
      case 'environmental':
        return <Box as={FaExclamationTriangle} boxSize={4} mr={2} />;
      case 'health':
        return <Box as={FaChartLine} boxSize={4} mr={2} />;
      default:
        return <Box as={FaUsers} boxSize={4} mr={2} />;
    }
  };

  return (
    <Box 
      bg="rgba(0, 24, 38, 0.95)"
      p={8}
      borderRadius="xl"
      border="1px solid rgba(0, 255, 255, 0.2)"
      boxShadow="0 0 30px rgba(0, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      w="full"
    >
      <Stack direction="row" justify="space-between" mb={6} align="center">
        <Heading 
          size="xl"
          color="cyan.400"
          letterSpacing="wider"
          textTransform="uppercase"
          fontWeight="bold"
        >
          Crisis Management Dashboard
        </Heading>
        <Box flex="1" />
        {!isConnected ? (
          <Button 
            onClick={handleConnectWallet}
            variant="outline"
            colorScheme="cyan"
            size="lg"
            mr={{ base: 0, md: 0, lg: 8, xl: 16 }}
            style={{ minWidth: '170px' }}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button 
            onClick={() => walletManager.disconnect()}
            variant="outline"
            colorScheme="cyan"
            size="lg"
            mr={{ base: 0, md: 0, lg: 8, xl: 16 }}
            style={{ minWidth: '170px' }}
          >
            Disconnect
          </Button>
        )}
      </Stack>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Box gridColumn="span 2" p={4}>
          <Card p={4}>
            <CardHeader>
              <Heading size="md">Active Crises</Heading>
            </CardHeader>
            <CardBody>
              <Stack gap={4} align="stretch">
                {activeCrises.map((crisis) => (
                  <Card
                    key={crisis.id}
                    onClick={() => handleCrisisClick(crisis)}
                    cursor="pointer"
                    bg="rgba(0, 36, 57, 0.95)"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                    }}
                    transition="all 0.2s ease-in-out"
                    p={4}
                  >
                    <CardBody>
                      <Stack direction="row" justify="space-between" mb={2}>
                        <Heading size="sm">{crisis.title}</Heading>
                        <Badge 
                          colorScheme={getSeverityColor(crisis.severity)}
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          {crisis.severity}
                        </Badge>
                      </Stack>
                      <Text color="gray.300" mb={2}>
                        {crisis.description}
                      </Text>
                      <Progress 
                        value={crisis.progress} 
                        size="sm" 
                        colorScheme="cyan"
                        bg="whiteAlpha.200"
                        borderRadius="full"
                        mb={2}
                      />
                      <Text fontSize="xs" color="cyan.200">
                        Progress: {crisis.progress}%
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Box>

        <Card maxW="340px" w="100%" p={4}>
          <CardHeader>
            <Heading size="md">Crisis Details</Heading>
          </CardHeader>
          <CardBody>
            {selectedCrisis ? (
              <Stack gap={4} align="stretch">
                <Box>
                  <Text color="cyan.200" fontWeight="bold">Type</Text>
                  <Stack direction="row" align="center">
                    {getTypeIcon(selectedCrisis.type)}
                    <Text color="gray.300">{selectedCrisis.type}</Text>
                  </Stack>
                </Box>
                <Box borderBottom="1px" borderColor="rgba(0, 255, 255, 0.2)" my={4} />
                <Box>
                  <Text color="cyan.200" fontWeight="bold">Required Actions</Text>
                  <Stack gap={2}>
                    {selectedCrisis.requiredActions.map((action, index) => (
                      <Text key={index} color="gray.300">• {action}</Text>
                    ))}
                  </Stack>
                </Box>
                <Box borderBottom="1px" borderColor="rgba(0, 255, 255, 0.2)" my={4} />
                <Box>
                  <Text color="cyan.200" fontWeight="bold">Current Actions</Text>
                  <Stack gap={2}>
                    {selectedCrisis.currentActions.map((action, index) => (
                      <Text key={index} color="gray.300">• {action}</Text>
                    ))}
                  </Stack>
                </Box>
                <Box borderBottom="1px" borderColor="rgba(0, 255, 255, 0.2)" my={4} />
                <Box>
                  <Text color="cyan.200" fontWeight="bold">Participants</Text>
                  <Stack gap={2} direction="row">
                    {selectedCrisis.participants.map((participant, index) => (
                      <Badge 
                        key={index} 
                        colorScheme="cyan"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        {participant}
                      </Badge>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <Text color="gray.300">Select a crisis to view details</Text>
            )}
          </CardBody>
        </Card>
      </Grid>

      {selectedCrisis && isConnected && (
        <Box mt={4}>
          <Button 
            onClick={handleDeclareCrisis} 
            mr={2}
            variant="outline"
            colorScheme="cyan"
            size="lg"
          >
            Declare Crisis
          </Button>
          <Button 
            onClick={() => handleRespondToCrisis(100)}
            variant="outline"
            colorScheme="cyan"
            size="lg"
          >
            Respond (100 points)
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CrisisDashboard;