import React, { useEffect, useState } from "react";

export default function PaymentStatusListener() {
  const [payments, setPayments] = useState([]);

  return (
    <div
      style={{ maxWidth: 400, margin: "auto", fontFamily: "Arial, sans-serif" }}
      data-oid="7ri738b"
    >
      <h3 data-oid="wlxaj8e">💰 Live Payment Updates</h3>
      {payments.length === 0 && (
        <p className="h-[fit-content]" data-oid="m2wnmu8">
          No payments yet.
        </p>
      )}
      <ul style={{ listStyle: "none", padding: 0 }} data-oid="s_mh-zg">
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
            data-oid="o7:p6d-"
          >
            <strong data-oid="5-nl.63">{payment.phone}</strong> paid{" "}
            <strong data-oid="b7ji9tf">{payment.amount} RWF</strong> —{" "}
            <em data-oid="fqt9w2.">{payment.status}</em>
            <br data-oid="qicakli" />
            <small data-oid="3s4sp5o">{payment.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
