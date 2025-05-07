import { IconType } from 'react-icons';
import { IconProps } from '@chakra-ui/react';

declare module '@chakra-ui/react' {
  interface IconProps {
    as?: IconType;
  }
} 