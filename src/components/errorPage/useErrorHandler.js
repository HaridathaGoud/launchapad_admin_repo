import { useState } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    setError(error);
  };

  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
};

export default useErrorHandler;