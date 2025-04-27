/**
 * Mock implementation of Next.js font module
 * This is used to prevent errors when importing from next/font/google
 */

// Create a mock font function that returns an object with the expected properties
const createFont = (fontName) => {
  return {
    variable: `--font-${fontName.toLowerCase()}`,
    className: `font-${fontName.toLowerCase()}`,
    style: {
      fontFamily: fontName,
    },
  };
};

// Export named exports for each font
export const Orbitron = () => createFont('Orbitron');
export const Geist = () => createFont('Geist');
export const Geist_Mono = () => createFont('Geist Mono');

// Default export for dynamic font creation
export default function font(options) {
  const fontName = options.family || 'Default';
  return createFont(fontName);
} 