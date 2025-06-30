import React, { useEffect, useState } from "react";
import TransactionTracker from "../components/payment/Transaction_tracker";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const PaymentStatus: React.FC = () => {
  const [showTracker, setShowTracker] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "failed" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const transactionId = new URLSearchParams(window.location.search).get("txid");

  const handleStartTransaction = () => {
    if (!transactionId) {
      setErrorMessage(
        "No transaction ID found. Please initiate a new payment from the dashboard.",
      );
      setTransactionStatus("error");
      return;
    }
    setShowTracker(true);
    setTransactionStatus("pending");
    setErrorMessage(null);
  };

  const handleTransactionComplete = (success: boolean) => {
    setTransactionStatus(success ? "success" : "failed");
    setShowTracker(false);
  };

  useEffect(() => {
    handleStartTransaction();
  }, []);

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-100"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fallback background
      }}
      data-oid="fbv5ls:"
    >
      {errorMessage ? (
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          data-oid="w10qz9b"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="2vs1dt6"
          >
            <AlertCircle
              className="w-10 h-10 text-red-500"
              data-oid="xuh48dz"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="fvy9_5b"
          >
            Transaction Error
          </h2>
          <p className="text-gray-600 mb-6" data-oid="ryr757l">
            {errorMessage}
          </p>
          <button
            className="bg-gradient-to-r from-red-500 to-deep-red-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-deep-red-600 transition"
            onClick={goToDashboard}
            type="button"
            data-oid="s9nxf80"
          >
            Go to Dashboard
          </button>
        </div>
      ) : showTracker && transactionId ? (
        <TransactionTracker
          transactionAmount="2000 RWF"
          merchantName="Kohereza Amafaranga"
          transactionId={transactionId}
          data-oid="7dcuty_"
        />
      ) : (
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in"
          data-oid="-4pz1-h"
        >
          {transactionStatus === "success" ? (
            <>
              <div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                data-oid="mvw7p:g"
              >
                <CheckCircle
                  className="w-10 h-10 text-green-500"
                  data-oid="0bhtr.:"
                />
              </div>
              <h2
                className="text-2xl font-bold text-gray-800 mb-2"
                data-oid="g.g:uw0"
              >
                Transaction Successful!
              </h2>
              <p className="text-gray-600 mb-6" data-oid="jdo4jrh">
                Your payment of 2000 RWF to Kohereza Amafaranga was successful.
              </p>
              <button
                className="bg-gradient-to-r from-green-500 to-deep-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-green-600 hover:to-deep-indigo-600 transition"
                onClick={goToDashboard}
                type="button"
                data-oid="4ezin1:"
              >
                Go to Dashboard
              </button>
            </>
          ) : transactionStatus === "failed" ? (
            <>
              <div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                data-oid="2vrv5_d"
              >
                <AlertCircle
                  className="w-10 h-10 text-red-500"
                  data-oid="03:ools"
                />
              </div>
              <h2
                className="text-2xl font-bold text-gray-800 mb-2"
                data-oid="9wtnj.x"
              >
                Transaction Failed
              </h2>
              <p className="text-gray-600 mb-6" data-oid="6-qknmg">
                Your payment of 2000 RWF to Kohereza Amafaranga could not be
                processed.
              </p>
              <button
                className="bg-gradient-to-r from-red-500 to-deep-red-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-deep-red-600 transition"
                onClick={goToDashboard}
                type="button"
                data-oid="utfii1m"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center" data-oid="o5h5-rz">
              <Loader2
                className="w-10 h-10 text-indigo-600 animate-spin mb-4"
                data-oid="r:n7vhe"
              />

              <p className="text-gray-600" data-oid="a4s-t0g">
                Loading transaction status...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
