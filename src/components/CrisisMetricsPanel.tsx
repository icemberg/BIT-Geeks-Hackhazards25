import React from 'react';
import {
    Box,
    Text,
    Stack,
    Heading,
    Flex,
} from '@chakra-ui/react';
import { Progress } from '@chakra-ui/progress';

const CrisisMetricsPanel: React.FC = () => {
    const [metrics, setMetrics] = React.useState({
        pollution: 26,
        energy: 45,
        water: 78,
        health: 92
    });

    const fetchMetrics = async () => {
        try {
            const response = await fetch('/api/metrics');
            const data = await response.json();
            if (data.success) {
                setMetrics(data.data);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    };

    React.useEffect(() => {
        fetchMetrics();
        const intervalId = window.setInterval(fetchMetrics, 5000);
        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <Box 
            bg="rgba(0, 24, 38, 0.95)"
            p={3}
            borderRadius="xl"
            border="1px solid rgba(0, 255, 255, 0.2)"
            boxShadow="0 0 20px rgba(0, 255, 255, 0.1)"
            mb={6}
            maxW="350px"
            mx="auto"
        >
            <Stack gap={2} alignItems="stretch">
                <MetricBar label="Pollution" value={metrics.pollution} color="red" />
                <MetricBar label="Energy" value={metrics.energy} color="cyan" />
                <MetricBar label="Water" value={metrics.water} color="blue" />
                <MetricBar label="Health" value={metrics.health} color="green" />
            </Stack>
        </Box>
    );
};

interface MetricBarProps {
    label: string;
    value: number;
    color: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, color }) => (
    <Box>
        <Flex justify="space-between" mb={1}>
            <Text color="cyan.200" fontWeight="bold" letterSpacing="wide">
                {label.toUpperCase()}
            </Text>
            <Text color="white" fontWeight="bold">
                {value}%
            </Text>
        </Flex>
        <Progress
            value={value}
            colorScheme={color}
            bg="whiteAlpha.200"
            borderRadius="full"
            height="2px"
            sx={{
                '& > div': {
                    transition: 'all 0.3s ease-in-out',
                }
            }}
        />
    </Box>
);

export default CrisisMetricsPanel;