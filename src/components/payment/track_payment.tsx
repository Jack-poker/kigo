import React, { useEffect, useState } from 'react';

export default function PaymentStatusListener() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Replace with your actual WebSocket URL
    const ws = new WebSocket('ws://wallet.kaascan.com/ws');

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 Payment update:', data);

        // Add new payment update to list (latest on top)
        setPayments(prev => [data, ...prev]);
      } catch (error) {
        console.error('❌ Invalid JSON message:', event.data);
      }
    }; 

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h3>💰 Live Payment Updates</h3>
      {payments.length === 0 && <p>No payments yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {payments.map((payment, i) => (
          <li
            key={i}
            style={{
              marginBottom: 10,
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 5,
              backgroundColor: payment.status === 'success' ? '#d4edda' : '#f8d7da',
              color: payment.status === 'success' ? '#155724' : '#721c24'
            }}
          >
            <strong>{payment.phone}</strong> paid <strong>{payment.amount} RWF</strong> — <em>{payment.status}</em><br />
            <small>{payment.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
