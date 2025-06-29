import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  CheckCircle,
  Loader2,
  CreditCard,
  Shield,
  Zap,
  XCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

interface TransactionTrackerProps {
  onComplete?: (success: boolean) => void;
  transactionAmount?: string;
  merchantName?: string;
  transactionId: string;
  token?: string;
}

const TransactionTracker: React.FC<TransactionTrackerProps> = ({
  onComplete,
  transactionAmount = "$25.99",
  merchantName = "Kid's Store",
  transactionId,
  token,
}) => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null,
  );
  const isPollingRef = useRef(false);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const POLLING_INTERVAL = 5000;
  const REQUEST_TIMEOUT = 10000;

  const steps = [
    { icon: CreditCard, label: "Processing Payment", duration: 15 },
    { icon: Shield, label: "Verifying Security", duration: 20 },
    { icon: Zap, label: "Finalizing Transaction", duration: 25 },
  ];

  // Notify parent of invalid transactionId after render
  useEffect(() => {
    if (!transactionId || transactionId.trim() === "") {
      setTimeout(() => {
        onComplete?.(false);
      }, 0); // Defer to next tick to avoid render-phase update
    }
  }, [transactionId, onComplete]);

  // Countdown timer
  useEffect(() => {
    if (isComplete || !transactionId || transactionId.trim() === "") return;

    countdownTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        const newProgress = ((60 - newTime) / 60) * 100;
        setProgress(newProgress);

        if (newProgress < 25) setCurrentStep(0);
        else if (newProgress < 65) setCurrentStep(1);
        else setCurrentStep(2);

        if (newTime <= 0) {
          setIsComplete(true);
          setTransactionSuccess(false);
          setError("Transaction timed out. Please try again.");
          onComplete?.(false);
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isComplete, transactionId, onComplete]);

  // Polling logic
  const fetchPaymentStatus = useCallback(async () => {
    if (isPollingRef.current || !transactionId || transactionId.trim() === "")
      return;

    isPollingRef.current = true;
    try {
      const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(
        "https://auto.kaascan.com/webhook/checkpaymentstatus",
        { transaction_id: transactionId },
        { headers, timeout: REQUEST_TIMEOUT },
      );

      const body = res.data;
      if (!Array.isArray(body) || body.length === 0) {
        throw new Error("Invalid API response: body is missing or empty");
      }

      const item = body[0];
      const status = (
        item.transaction_status ||
        item.status ||
        ""
      ).toLowerCase();
      if (!["pending", "success", "successful", "failed"].includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      if (status === "pending") {
        setError(null);
      } else {
        setIsComplete(true);
        const isSuccess = status === "success" || status === "successful";
        setTransactionSuccess(isSuccess);
        onComplete?.(isSuccess);
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      }
    } catch (err: any) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403 ||
        err.response?.status === 404 ||
        err.message.includes("Invalid API response")
      ) {
        setIsComplete(true);
        setTransactionSuccess(false);
        setError(
          err.response?.status === 401
            ? "Authentication failed. Please log in and try again."
            : err.response?.status === 403
              ? "Access denied. Please ensure you have permission."
              : err.response?.status === 404
                ? "Transaction not found. Please verify your transaction ID."
                : "Invalid response from server.",
        );
        onComplete?.(false);
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      } else {
        setError("Connection issue detected. Retrying...");
      }
    } finally {
      isPollingRef.current = false;
    }
  }, [transactionId, token, onComplete]);

  // Polling timer
  useEffect(() => {
    if (isComplete || !transactionId || transactionId.trim() === "") return;

    fetchPaymentStatus();
    pollingTimerRef.current = setInterval(fetchPaymentStatus, POLLING_INTERVAL);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isComplete, transactionId, fetchPaymentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
    <div
      className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
      data-oid="d0pswkq"
    />
  );

  const handleRetry = () => {
    setIsComplete(false);
    setTransactionSuccess(null);
    setError(null);
    setTimeLeft(60);
    setProgress(0);
    setCurrentStep(0);
  };

  // Render invalid transactionId case
  if (!transactionId || transactionId.trim() === "") {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center p-4"
        data-oid="_pj5paf"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid="voisv8l"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid=".og2asr"
          >
            <AlertCircle
              className="w-10 h-10 text-red-500"
              data-oid="q2oqwkv"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="z9rrpwi"
          >
            Transaction Error
          </h2>
          <p className="text-gray-600 mb-4" data-oid="innpb23">
            No transaction ID provided. Please start a new payment from the
            dashboard.
          </p>
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
            onClick={() => (window.location.href = "/dashboard")}
            type="button"
            data-oid="yocc1zj"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render failure case
  if (isComplete && (error || transactionSuccess === false)) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center p-4"
        data-oid="duryjyn"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid="rw3y5n2"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="klwbrgj"
          >
            <XCircle className="w-10 h-10 text-red-500" data-oid="2pal-mr" />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="zfqgfcw"
          >
            Transaction Failed
          </h2>
          <p className="text-gray-600 mb-4" data-oid="06-cpjc">
            {error ||
              `Your payment of ${transactionAmount} to ${merchantName} was unsuccessful.`}
          </p>
          <div className="flex justify-center gap-4" data-oid="6qv08v6">
            <button
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
              onClick={handleRetry}
              type="button"
              data-oid="kfw6r4j"
            >
              Retry
            </button>
            <button
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-gray-600 hover:to-gray-700 transition"
              onClick={() => (window.location.href = "/dashboard")}
              type="button"
              data-oid="ztd8ux4"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render success case
  if (isComplete) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center p-4"
        data-oid="eoc18l8"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid="lq10b19"
        >
          <div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="nuplrt8"
          >
            <CheckCircle
              className="w-10 h-10 text-green-500"
              data-oid="1c2dxti"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="u:s7c75"
          >
            Transaction Complete!
          </h2>
          <p className="text-gray-600 mb-4" data-oid="-ve0z7k">
            Your payment of {transactionAmount} to {merchantName} was
            successful.
          </p>
          <button
            className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-green-600 hover:to-indigo-700 transition"
            onClick={() => (window.location.href = "/dashboard")}
            type="button"
            data-oid="4.51pjb"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render processing state
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
      data-oid="dlp5osn"
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} data-oid="52m-tc1" />
      ))}
      <div
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10"
        data-oid="g47opsj"
      >
        <div className="text-center mb-8" data-oid="g9_y4h2">
          <div
            className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
            data-oid=":1w1dwu"
          >
            <Clock className="w-8 h-8 text-white" data-oid="665d22q" />
          </div>
          <h1
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="e0g1n2_"
          >
            Processing Your Transaction
          </h1>
          <p className="text-gray-600" data-oid="y9ops-o">
            Please wait while we securely process your payment
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2" data-oid=":_hht2p">
              {error}
            </p>
          )}
        </div>
        <div
          className="bg-gradient-to-r from-yellow-50 to-indigo-50 rounded-2xl p-4 mb-6"
          data-oid="b9wsi88"
        >
          <div
            className="flex justify-between items-center mb-2"
            data-oid="oxz.0ya"
          >
            <span className="text-gray-600" data-oid="hxe87-2">
              Amount:
            </span>
            <span
              className="font-bold text-lg text-indigo-700"
              data-oid="9bprd:r"
            >
              {transactionAmount}
            </span>
          </div>
          <div
            className="flex justify-between items-center mb-2"
            data-oid="cb26b:9"
          >
            <span className="text-gray-600" data-oid="chf1k-e">
              Transaction Fee:
            </span>
            <span className="font-semibold text-indigo-700" data-oid="e:4vwg3">
              $0.50
            </span>
          </div>
          <div className="flex justify-between items-center" data-oid="3hz56oh">
            <span className="text-gray-600" data-oid="b0h:ykk">
              Merchant:
            </span>
            <span className="font-semibold text-indigo-700" data-oid="3dbmjad">
              {merchantName}
            </span>
          </div>
        </div>
        <div className="relative w-32 h-32 mx-auto mb-6" data-oid="26tyieu">
          <svg
            className="w-full h-full"
            transform="rotate(-90)"
            viewBox="0 0 36 36"
            data-oid="cnvi6xs"
          >
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              data-oid=".wj8wku"
            />

            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              data-oid="wwzoewb"
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            data-oid="m6uyqf5"
          >
            <div className="text-center" data-oid="shmck:-">
              <div
                className="text-2xl font-bold text-indigo-700"
                data-oid="qrs2rw5"
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500" data-oid="4i856ya">
                remaining
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 mb-6" data-oid="9deejo9">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center p-3 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-100 to-indigo-100 border-2 border-yellow-300"
                    : isCompleted
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                }`}
                data-oid="8-oy5ha"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-400 to-indigo-500 text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                  data-oid="38dg6uq"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" data-oid="an5iy4l" />
                  ) : isActive ? (
                    <Loader2
                      className="w-5 h-5 animate-spin"
                      data-oid="m38cplr"
                    />
                  ) : (
                    <StepIcon className="w-5 h-5" data-oid="p.hy.u6" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isActive
                      ? "text-indigo-700"
                      : isCompleted
                        ? "text-green-700"
                        : "text-gray-600"
                  }`}
                  data-oid="mes-vwl"
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="bg-gradient-to-r from-yellow-100 to-indigo-100 rounded-2xl p-4 text-center"
          data-oid="s2lfbfc"
        >
          <p className="text-sm text-gray-700" data-oid="cwmty_2">
            <span className="font-semibold" data-oid="q0f6kj3">
              💡 Did you know?
            </span>
            <br data-oid="v1ckhgs" />
            Your transaction is protected by bank-level encryption!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionTracker;
