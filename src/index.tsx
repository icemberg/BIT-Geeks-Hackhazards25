import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from 'react-error-boundary';
import * as Sentry from '@sentry/react';
import { browserTracingIntegration}  from '@sentry/browser';

Sentry.init({
  dsn: process.env.SENTRY_AUTH_TOKEN,
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});


const ErrorFallback = ({ error }: { error: Error }) => (
  <div>
    <h2>Something went wrong</h2>
    <pre>{error.message}</pre>
    <pre>{error.stack}</pre>
  </div>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
    fallback={({error}) => (
      <div>
        <h2>Error: {(error as Error).message}</h2>
        <pre>{(error as Error).stack}</pre>
      </div>
    )}
  >
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </Sentry.ErrorBoundary>
  </React.StrictMode>
); 