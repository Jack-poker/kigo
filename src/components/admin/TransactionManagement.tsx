import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  transaction_id: string;
  parent_id: string;
  student_id?: string;
  amount_sent: number;
  fee: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  parent?: { fullnames: string };
  student?: { student_name: string };
}

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch CSRF token with retry logic and exponential backoff
  const fetchCsrfToken = async (retries = 3, initialDelay = 1000): Promise<string | null> => {
    let delay = initialDelay;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get('http://localhost:8001/admin/get-csrf-token', {
          withCredentials: true, // Send session_id cookie
          timeout: 5000, // 5 second timeout
        });
        console.log('🔑 CSRF Token fetched successfully');
        setCsrfToken(response.data.csrf_token);
        setError('');
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || 'Failed to fetch CSRF token';
        console.error(`🚫 CSRF token error (attempt ${attempt}):`, err);
        if (attempt === retries) {
          setError(errorMsg);
          return null;
        }
        // Exponential backoff with jitter
        await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * 300));
        delay *= 2; // Double the delay for next attempt
      }
    }
    return null;
  };

  // Fetch transactions with caching
  const fetchTransactions = async () => {
    if (!csrfToken) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8001/admin/transactions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true, // Send session_id cookie
        timeout: 8000, // 8 second timeout
      });
      setTransactions(response.data);
      // Cache the transactions data with a 2-minute TTL
      localStorage.setItem('cachedTransactions', JSON.stringify({
        data: response.data,
        timestamp: Date.now(),
        expiry: Date.now() + 2 * 60 * 1000 // 2 minutes
      }));
      setLoading(false);
      setError('');
    } catch (err: any) {
      // Try to use cached data if available
      const cachedData = localStorage.getItem('cachedTransactions');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.expiry > Date.now()) {
            console.log('📦 Using cached transaction data');
            setTransactions(parsed.data);
            setError('Unable to fetch fresh data. Showing cached data.');
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Cache parsing error:', e);
        }
      }
      
      const errorMsg = err.response?.data?.detail || 'Failed to fetch transactions';
      setError(errorMsg);
      console.error('🚫 Transactions fetch error:', err);
      setLoading(false);
    }
  };

  // Fetch transaction details
  const handleViewTransaction = async (transaction_id: string) => {
    try {
      const response = await axios.get(`http://localhost:8001/admin/transactions/${transaction_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true, // Send session_id cookie
        timeout: 5000, // 5 second timeout
      });
      setSelectedTransaction(response.data);
      setError('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch transaction details';
      setError(errorMsg);
      console.error('🚫 Transaction fetch error:', err);
    }
  };

  // Initial CSRF token fetch
  useEffect(() => {
    fetchCsrfToken();
    
    // Try to load cached transactions while waiting for fresh data
    const cachedData = localStorage.getItem('cachedTransactions');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.expiry > Date.now()) {
          console.log('📦 Using cached transaction data initially');
          setTransactions(parsed.data);
          setLoading(false);
        }
      } catch (e) {
        console.error('Cache parsing error:', e);
      }
    }
    
    return () => {
      // Cleanup function
      console.log('🧹 Cleaning up TransactionManagement component');
    };
  }, []);

  // Fetch transactions when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchTransactions();
    }
  }, [csrfToken]);

  // Handle refresh
  const handleRefresh = async () => {
    const token = await fetchCsrfToken();
    if (token) {
      await fetchTransactions();
    }
  };

  // Empty state component
  const EmptyTransactionState = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-center">
      <div className="w-48 h-48 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <path d="M6 15h.01M9 15h.01" />
          <path d="M6 5v-2" />
          <path d="M18 5v-2" />
          <path d="M12 22v-2" />
          <path d="M12 17v-2" />
          <path d="M16 15h2" />
          <circle cx="12" cy="12" r="8" stroke="#4ade80" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M12 9v3l1.5 1.5" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Transactions Yet</h3>
      <p className="text-gray-600 mb-6">Transactions will appear here once parents start making payments.</p>
      <button
        onClick={handleRefresh}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Refresh
      </button>
    </div>
  );

  // Loading skeleton component
  const TransactionSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-7 gap-2">
                  {[...Array(7)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-8 bg-gray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Transaction Management</h2>
          <p className="text-green-100">Monitor and manage all financial transactions</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>
      
      {/* Error message with dismiss button */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {loading && <TransactionSkeleton />}
      
      {/* Empty state */}
      {!loading && !error && transactions.length === 0 && <EmptyTransactionState />}
      
      {/* Transaction data */}
      {!loading && !error && transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <th className="py-3 px-4 text-left font-semibold">ID</th>
                      <th className="py-3 px-4 text-left font-semibold">Parent</th>
                      <th className="py-3 px-4 text-left font-semibold">Student</th>
                      <th className="py-3 px-4 text-left font-semibold">Amount</th>
                      <th className="py-3 px-4 text-left font-semibold">Fee</th>
                      <th className="py-3 px-4 text-left font-semibold">Date</th>
                      <th className="py-3 px-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr 
                        key={transaction.transaction_id} 
                        className="hover:bg-green-50 transition-colors duration-150 ease-in-out"
                      >
                        <td className="py-3 px-4 font-mono text-sm">{transaction.transaction_id.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          {transaction.parent?.fullnames || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {transaction.student?.student_name || '-'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-600">
                          RWF {transaction.amount_sent.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          RWF {transaction.fee.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewTransaction(transaction.transaction_id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors duration-150 ease-in-out flex items-center justify-center text-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Transaction details panel */}
          <div>
            {selectedTransaction ? (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 transition-all duration-300 transform hover:shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600">RWF {selectedTransaction.amount_sent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Fee:</span>
                    <span className="text-gray-800">RWF {selectedTransaction.fee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Transaction ID</label>
                    <div className="mt-1 font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto">
                      {selectedTransaction.transaction_id}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Parent</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedTransaction.parent?.fullnames || '-'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Student</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedTransaction.student?.student_name || '-'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Description</label>
                    <div className="mt-1 bg-gray-50 p-2 rounded border border-gray-200 min-h-[60px]">
                      {selectedTransaction.description || 'No description provided'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date & Time</label>
                    <div className="mt-1 bg-gray-50 p-2 rounded border border-gray-200">
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  {selectedTransaction.latitude && selectedTransaction.longitude && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Location</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded border border-gray-200">
                        Lat: {selectedTransaction.latitude.toFixed(6)}, Long: {selectedTransaction.longitude.toFixed(6)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-1">No Transaction Selected</h3>
                <p className="text-gray-500 text-sm">Click on "View" button to see transaction details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;