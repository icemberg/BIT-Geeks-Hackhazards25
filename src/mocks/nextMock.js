/**
 * Mock implementation of Next.js core module
 * This is used to prevent errors when importing from next
 */

// Re-export the dynamic import mock
import dynamic from './nextDynamicMock';

// Export other Next.js functionality as needed
export { dynamic };

// Default export
export default {
  dynamic
}; 