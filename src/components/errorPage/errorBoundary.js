import React from 'react';
import ErrorPage from './errorPage'; // Import your custom error page component

const ErrorBoundary = ({ error }) => {
  if (error) {
    return <ErrorPage />;
  }

  return null;
};

export default ErrorBoundary;