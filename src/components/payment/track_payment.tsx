import React, { useEffect, useState } from "react";

export default function PaymentStatusChip() {
  const [payment, setPayment] = useState(null); // Single pending transaction

  // Simulate fetching a pending transaction (replace with WebSocket/API logic)
  useEffect(() => {
    // Example: Set a sample pending transaction for demonstration
    setPayment({
      phone: "0781234567",
      amount: 1000,
      status: "pending",
      timestamp: new Date().toLocaleString(),
    });
    // In production, use WebSocket or API polling to update payment
  }, []);

  // Do not render anything if no pending transaction
  if (!payment) return null;

  return (
    <div
      className="fixed bottom-2 right-2 max-w-[200px] sm:max-w-[250px] font-sans"
      style={{ fontFamily: "Arial, sans-serif" }}
      data-oid="rxj.pj6"
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand text-white rounded-full shadow-md hover:scale-105 transition-transform duration-200 text-xs sm:text-sm"
        data-oid="gs.n3hf"
      >
        <span
          className="text-yellow-400 font-semibold truncate"
          data-oid="85t2l0-"
        >
          {payment.phone}
        </span>
        <span className="truncate" data-oid="u-t6yf2">
          <strong className="text-yellow-400" data-oid="o6-xp7b">
            {payment.amount} RWF
          </strong>
        </span>
        <span
          className="italic truncate"
          style={{ color: payment.status === "pending" ? "#facc15" : "#fff" }}
          data-oid="5q5e_6e"
        >
          {payment.status}
        </span>
        <small
          className="text-gray-300 hidden sm:inline truncate"
          data-oid="q4bu35p"
        >
          {payment.timestamp}
        </small>
      </div>
    </div>
  );
}
