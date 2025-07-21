import React, { useEffect, useState } from "react";
import TransactionTracker from "../components/payment/Transaction_tracker";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
const transactionId = new URLSearchParams(window.location.search).get("txid");
const amount = new URLSearchParams(window.location.search).get("amount_data");


const PaymentStatus: React.FC = () => {
  const [showTracker, setShowTracker] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "failed" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const transactionId = new URLSearchParams(window.location.search).get("txid");
  const amount = new URLSearchParams(window.location.search).get("amount_data");

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
        backgroundImage:
          "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
      data-oid="dc54v2a"
    >
      {errorMessage ? (
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          data-oid="ita3g56"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="4q9gn3."
          >
            <AlertCircle
              className="w-10 h-10 text-red-500"
              data-oid="fk2ipv_"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="ptuye6f"
          >
            Transaction Error
          </h2>
          <p className="text-gray-600 mb-6" data-oid="nr.:xsc">
            {errorMessage}
          </p>
          <button
            className="bg-gradient-to-r from-red-500 to-deep-red-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-deep-red-600 transition"
            onClick={goToDashboard}
            type="button"
            data-oid="55eq01s"
          >
            Go to Dashboard
          </button>
        </div>
      ) : showTracker && transactionId ? (
        <TransactionTracker
          transactionAmount={amount + " RWF"}
          merchantName="PARENT"
          transactionId={transactionId}
          data-oid="9s:ooux"
        />
      ) : (
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in"
          data-oid="caolu9w"
        >
          {transactionStatus === "success" ? (
            <>
              <div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                data-oid="1i0lkl4"
              >
                <CheckCircle
                  className="w-10 h-10 text-green-500"
                  data-oid="nri276q"
                />
              </div>
              <h2
                className="text-2xl font-bold text-gray-800 mb-2"
                data-oid="a654ggi"
              >
                Transaction Successful!
              </h2>
              <p className="text-gray-600 mb-6" data-oid="jg5_y__">
                Your payment of ${amount} RWF to Kohereza Amafaranga was successful.
              </p>
              <button
                className="bg-gradient-to-r from-green-500 to-deep-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-green-600 hover:to-deep-indigo-600 transition"
                onClick={goToDashboard}
                type="button"
                data-oid="q0u9rf3"
              >
                Go to Dashboard
              </button>
            </>
          ) : transactionStatus === "failed" ? (
            <>
              <div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                data-oid="a-5wp1q"
              >
                <AlertCircle
                  className="w-10 h-10 text-red-500"
                  data-oid=".o-yo.i"
                />
              </div>
              <h2
                className="text-2xl font-bold text-gray-800 mb-2"
                data-oid="d.lshqg"
              >
                Transaction Failed
              </h2>
              <p className="text-gray-600 mb-6" data-oid="g-ukbik">
                Your payment of 2000 RWF to Kohereza Amafaranga could not be
                processed.
              </p>
              <button
                className="bg-gradient-to-r from-red-500 to-deep-red-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-deep-red-600 transition"
                onClick={goToDashboard}
                type="button"
                data-oid="4uruw-z"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center" data-oid="qdo:g:r">
              <Loader2
                className="w-10 h-10 text-indigo-600 animate-spin mb-4"
                data-oid="l4wmrtw"
              />

              <p className="text-gray-600" data-oid="d76gmic">
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
