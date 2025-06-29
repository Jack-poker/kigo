import React, { useEffect, useState } from "react";

export default function PaymentStatusListener() {
  const [payments, setPayments] = useState([]);

  return (
    <div
      style={{ maxWidth: 400, margin: "auto", fontFamily: "Arial, sans-serif" }}
      data-oid="qa3qt5a"
    >
      <h3 data-oid="51hk25x">💰 Live Payment Updates</h3>
      {payments.length === 0 && (
        <p className="h-[fit-content]" data-oid="vfwndvl">
          No payments yet.
        </p>
      )}
      <ul style={{ listStyle: "none", padding: 0 }} data-oid=".-k8bap">
        {payments.map((payment, i) => (
          <li
            key={i}
            style={{
              marginBottom: 10,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 5,
              backgroundColor:
                payment.status === "success" ? "#d4edda" : "#f8d7da",
              color: payment.status === "success" ? "#155724" : "#721c24",
            }}
            data-oid="863.24j"
          >
            <strong data-oid="gl4v-10">{payment.phone}</strong> paid{" "}
            <strong data-oid="yz9kyqp">{payment.amount} RWF</strong> —{" "}
            <em data-oid="5vl-tn-">{payment.status}</em>
            <br data-oid="yevjeon" />
            <small data-oid="t64wc0h">{payment.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
