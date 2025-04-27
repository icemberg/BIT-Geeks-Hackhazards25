declare module 'react-animated-cursor' {
  import { ReactNode } from 'react';

  interface AnimatedCursorProps {
    color?: string;
    innerSize?: number;
    outerSize?: number;
    innerScale?: number;
    outerScale?: number;
    outerAlpha?: number;
    innerStyle?: React.CSSProperties;
    outerStyle?: React.CSSProperties;
    clickables?: Array<string | { target: string; outerStyle?: React.CSSProperties }>;
    trailingSpeed?: number;
    showSystemCursor?: boolean;
    outerStyle?: React.CSSProperties;
    innerStyle?: React.CSSProperties;
  }

  const AnimatedCursor: React.FC<AnimatedCursorProps>;
  export default AnimatedCursor;
} 