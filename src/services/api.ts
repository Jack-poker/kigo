const API_BASE_URL = 'https://auto.kaascan.com/webhook'; // Replace with your n8n webhook URL

// Student-related API calls
export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) throw new Error('Failed to add student');
    return await response.json();
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

// Wallet-related API calls
export const getWalletBalance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/balance`);
    if (!response.ok) throw new Error('Failed to fetch wallet balance');
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const depositToWallet = async (depositData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(depositData),
    });
    if (!response.ok) throw new Error('Failed to deposit to wallet');
    return await response.json();
  } catch (error) {
    console.error('Error depositing to wallet:', error);
    throw error;
  }
};

// Transaction-related API calls
export const fetchTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) throw new Error('Failed to add transaction');
    return await response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};