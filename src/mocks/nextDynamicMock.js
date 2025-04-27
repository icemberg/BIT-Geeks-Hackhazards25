/**
 * Mock implementation of Next.js dynamic import
 * This is used to prevent the _interop_require_default._ error
 */
import React, { lazy, Suspense } from 'react';

// Simple implementation that mimics Next.js dynamic import
const dynamic = (importFn, options = {}) => {
  // Create a lazy-loaded component
  const LazyComponent = lazy(importFn);
  
  // Create a wrapper component that handles loading state
  const DynamicComponent = (props) => {
    // If a loading component is provided, use it
    const LoadingComponent = options.loading || (() => null);
    
    return (
      <Suspense fallback={<LoadingComponent {...props} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
  
  // Add displayName for debugging
  DynamicComponent.displayName = options.loading ? 
    `Dynamic(${options.loading.displayName || 'Loading'})` : 
    'DynamicComponent';
  
  return DynamicComponent;
};

export default dynamic; 