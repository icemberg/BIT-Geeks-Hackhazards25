import React from 'react';
import {
  Box,
  Stack,
  Text,
  Badge,
  Heading,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Avatar, AvatarGroup } from '@chakra-ui/avatar';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { Progress } from '@chakra-ui/progress';
import { FaUsers, FaTasks } from 'react-icons/fa';

interface CollaborationTrackerProps {
  teamMembers: {
    name: string;
    role: string; 
    avatar: string;
  }[];
  progress: number;
  tasks: {
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
  }[];
}

const CollaborationTracker: React.FC<CollaborationTrackerProps> = ({
  teamMembers,
  progress,
  tasks,
}) => {
  return (
    <Card p={8} w="full">
      <CardHeader my={2} mx={50}>
        <Flex align="center" gap={4}>
          <Icon as={FaUsers} boxSize={12} mr={4} color="cyan.200" />
          <Heading size="md">Team Collaboration</Heading>
        </Flex>
      </CardHeader>
      <CardBody my={2} mx={100}>
        <Stack gap={4}>
          <Box>
            <Text mb={2}>Project Progress</Text>
            <Progress value={progress} colorScheme="blue" />
          </Box>
          
          <Box>
            <Text mb={2}>Team Members</Text>
            <AvatarGroup size="md" maxW="4rem">
              {teamMembers.map((member) => (
                <Avatar
                  key={member.name}
                  name={member.name}
                  src={member.avatar}
                />
              ))}
            </AvatarGroup>
          </Box>
          
          <Box>
            <Text mb={2}>Tasks</Text>
            <Stack gap={2}>
              {tasks.map((task, index) => (
                <Flex key={index} align="center" gap={2}>
                  <Icon as={FaTasks} boxSize={4} mr={2} />
                  <Text flex={1}>{task.title}</Text>
                  <Badge
                    colorScheme={
                      task.status === 'completed'
                        ? 'green'
                        : task.status === 'in-progress'
                        ? 'yellow'
                        : 'gray'
                    }
                  >
                    {task.status}
                  </Badge>
                </Flex>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default CollaborationTracker; 