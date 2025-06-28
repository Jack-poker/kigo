import React, { useEffect, useState } from "react";

export default function PaymentStatusListener() {
  const [payments, setPayments] = useState([]);

  return (
    <div
      style={{ maxWidth: 400, margin: "auto", fontFamily: "Arial, sans-serif" }}
      data-oid="hfo39a8"
    >
      <h3 data-oid="46hnrv2">💰 Live Payment Updates</h3>
      {payments.length === 0 && (
        <p data-oid="7i-my95" className="h-[fit-content]">
          No payments yet.
        </p>
      )}
      <ul style={{ listStyle: "none", padding: 0 }} data-oid="l.18tr_">
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
            data-oid="qwq:nue"
          >
            <strong data-oid="n3d3dr6">{payment.phone}</strong> paid{" "}
            <strong data-oid="bqp.2lm">{payment.amount} RWF</strong> —{" "}
            <em data-oid=":-5:arp">{payment.status}</em>
            <br data-oid="maoo42u" />
            <small data-oid="gj5-vtv">{payment.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
