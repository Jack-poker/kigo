import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Props interface
interface DepositStatusCheckerProps {
  transactionId: string | undefined; // Transaction ID from window.__lastDepositTransactionId
  apiUrl: string;                   // Base API URL (e.g., https://wallet.kaascan.com)
  token: string | null;             // JWT token from localStorage.getItem('token')
  t: (key: string) => string;       // Translation function (e.g., react-i18next)
  onStatusChange: (status: string) => void; // Callback for status updates
}

const DepositStatusChecker: React.FC<DepositStatusCheckerProps> = ({
  transactionId,
  apiUrl,
  token,
  t,
  onStatusChange,
}) => {
  // State for CSRF token, error, loading, and polling
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const MAX_ATTEMPTS = 60; // 5 minutes at 5s intervals
  const POLLING_INTERVAL = 5000; // 5 seconds

  // Fetch CSRF token with retry logic
  const fetchCsrfToken = async (retries = 3, delay = 1000): Promise<string | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(`${apiUrl}/admin/get-csrf-token`, {
          withCredentials: true, // Send session_id cookie
        });
        console.log('CSRF Token:', response.data.csrf_token); // Debug
        setCsrfToken(response.data.csrf_token);
        setError('');
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || t('csrfTokenFailed');
        console.error(`CSRF token error (attempt ${attempt}):`, err);
        if (attempt === retries) {
          setError(errorMsg);
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  };

  // Fetch transaction status
  const fetchStatus = async () => {
    if (!csrfToken || !transactionId) return;
    try {
      const response = await axios.get(`${apiUrl}/transactions/${transactionId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true, // Send session_id cookie
      });
      const { status } = response.data;
      setIsPolling(true);
      setAttempts(prev => prev + 1);
      setError('');

      // Trigger callback for status changes
      onStatusChange(status);

      // Stop polling on terminal state
      if (status === 'success' || status === 'failed') {
        setIsPolling(false);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || t('statusFetchFailed');
      setError(errorMsg);
      console.error('Status fetch error:', err);
      setIsPolling(false);
    }
  };

  // Initial CSRF token fetch
  useEffect(() => {
    if (transactionId && token) {
      fetchCsrfToken();
    } else {
      setError(t('missingParams'));
    }
  }, [transactionId, token, t]);

  // Start polling when CSRF token is available
  useEffect(() => {
    if (csrfToken && transactionId && token && attempts < MAX_ATTEMPTS) {
      fetchStatus(); // Initial fetch
      const interval = setInterval(fetchStatus, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [csrfToken, transactionId, token, attempts]);

  // Stop polling after max attempts
  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setIsPolling(false);
      setError(t('maxAttemptsReached'));
      onStatusChange('failed'); // Treat timeout as failure
    }
  }, [attempts, t, onStatusChange]);

  // Render minimal UI (loading or error)
  return (
    <div className="text-center p-4">
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : isPolling ? (
        <p className="text-emerald-600 text-sm">{t('checkingDepositStatus')}</p>
      ) : null}
    </div>
  );
};

export default DepositStatusChecker;