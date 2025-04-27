import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Text,
  Stack,
  HStack,
  Badge,
  Spinner,
  Flex,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { Progress } from '@chakra-ui/progress';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import { CrisisData, AIRecommendation } from '../types/ai';
import { aiService } from '../services/aiService';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ActionPlanProps {
  crisisId: string;
  onActionComplete: (actionId: string) => void;
  crisisData?: CrisisData;
}

const ActionPlan: React.FC<ActionPlanProps> = ({ crisisId, onActionComplete, crisisData }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!crisisData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiService.getRecommendations(crisisData);
      if (response.status === 'success') {
        setRecommendations(response.data);
      } else {
        setError(response.message || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('An error occurred while fetching recommendations');
    } finally {
      setLoading(false);
    }
  }, [crisisData]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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

  return (
    <Card p={8}>
      <CardHeader pb={4}>
        <Flex align="center" gap={4}>
          <Icon as={FaExclamationTriangle} boxSize={12} mr={4} color="cyan.200" />
          <Heading size="md">Team Collaboration</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Stack align="center" py={8}>
            <Spinner size="xl" />
            <Text>Analyzing crisis data...</Text>
          </Stack>
        ) : error ? (
          <Flex align="center" gap={8} py={8}>
            <Icon as={FaExclamationTriangle} boxSize={64} color="cyan.200" />
            <Text fontSize="2xl" color="cyan.100" fontFamily="'Orbitron', sans-serif">
              {error}
            </Text>
          </Flex>
        ) : recommendations ? (
          <Stack gap={4}>
            <Box>
              <Text fontWeight="bold">Severity Level</Text>
              <Badge
                colorScheme={getSeverityColor(recommendations.severityLevel)}
                fontSize="md"
                p={2}
                mt={1}
              >
                {recommendations.severityLevel}
              </Badge>
            </Box>

            <Box>
              <Text fontWeight="bold">AI Recommendations</Text>
              <Stack gap={2} mt={2}>
                {recommendations.recommendations.map((recommendation, index) => (
                  <Card key={index}>
                    <CardBody>
                      <HStack>
                        <Text flex={1}>{recommendation}</Text>
                        <Progress
                          value={recommendations.confidenceScore * 100}
                          size="sm"
                          colorScheme="blue"
                          w="100px"
                        />
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold">Estimated Resolution Time</Text>
              <Text>{recommendations.estimatedResolutionTime}</Text>
            </Box>
          </Stack>
        ) : (
          <Text>No crisis data available</Text>
        )}
      </CardBody>
    </Card>
  );
};

export default ActionPlan; 