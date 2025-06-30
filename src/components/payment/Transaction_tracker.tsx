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
      data-oid="nkplet7"
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
        data-oid="vq5hq2t"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid="qrat:xq"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="a9edk-c"
          >
            <AlertCircle
              className="w-10 h-10 text-red-500"
              data-oid="sw71jv6"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="xnstdqe"
          >
            Transaction Error
          </h2>
          <p className="text-gray-600 mb-4" data-oid="v7mcc6d">
            No transaction ID provided. Please start a new payment from the
            dashboard.
          </p>
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
            onClick={() => (window.location.href = "/dashboard")}
            type="button"
            data-oid="wicfj6k"
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
        className="min-h-screen from-yellow-50 to-indigo-100 flex items-center justify-center p-4 bg-none"
        data-oid="s4zxx-m"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid=":4z5c:r"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="lu43qm6"
          >
            <XCircle className="w-10 h-10 text-red-500" data-oid="x27gx6r" />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="z2-6eyg"
          >
            Transaction Failed
          </h2>
          <p className="text-gray-600 mb-4" data-oid="d2n_3ra">
            {error ||
              `Your payment of ${transactionAmount} to ${merchantName} was unsuccessful.`}
          </p>
          <div className="flex justify-center gap-4" data-oid="n85:y:v">
            <button
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
              onClick={handleRetry}
              type="button"
              data-oid="ivuyzax"
            >
              Retry
            </button>
            <button
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-gray-600 hover:to-gray-700 transition bg-[#000000F2]"
              onClick={() => (window.location.href = "/dashboard")}
              type="button"
              data-oid="g.6y_bp"
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
        data-oid=":_dq0s3"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid="67c-krm"
        >
          <div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="cgczkk5"
          >
            <CheckCircle
              className="w-10 h-10 text-green-500"
              data-oid="vxcl.v6"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="akrplg4"
          >
            Transaction Complete!
          </h2>
          <p className="text-gray-600 mb-4" data-oid="j6j2qyb">
            Your payment of {transactionAmount} to {merchantName} was
            successful.
          </p>
          <button
            className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-green-600 hover:to-indigo-700 transition"
            onClick={() => (window.location.href = "/dashboard")}
            type="button"
            data-oid="ynoiw58"
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
      className="min-h-screen from-yellow-50 via-yellow-100 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden bg-none bg-[#D12D2D00]"
      data-oid="k11xi.t"
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} data-oid="dq6_ez9" />
      ))}
      <div
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10"
        data-oid="bqthie4"
      >
        <div className="text-center mb-8" data-oid="1dju7_o">
          <div
            className="w-16 h-16 from-yellow-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse bg-[#29044F] bg-none opacity-[100%]"
            data-oid="vqte.z1"
          >
            <Clock className="w-8 h-8 text-white" data-oid="h9g3.wf" />
          </div>
          <h1
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="cav5vmm"
          >
            Processing Your Transaction
          </h1>
          <p className="text-gray-600" data-oid="b:fpd.5">
            Please wait while we securely process your payment
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2" data-oid="oexbmz9">
              {error}
            </p>
          )}
        </div>
        <div
          className="bg-gradient-to-r from-yellow-50 to-indigo-50 rounded-2xl p-4 mb-6"
          data-oid="2x.tgpi"
        >
          <div
            className="flex justify-between items-center mb-2"
            data-oid="mednq8d"
          >
            <span className="text-gray-600" data-oid="sfslf8f">
              Amount:
            </span>
            <span
              className="font-bold text-lg text-indigo-700"
              data-oid="ck5ze0g"
            >
              {transactionAmount}
            </span>
          </div>
          <div
            className="flex justify-between items-center mb-2"
            data-oid="3_h9_zt"
          >
            <span className="text-gray-600" data-oid="tyv4pm8">
              Transaction Fee:
            </span>
            <span className="font-semibold text-indigo-700" data-oid="7nv22pu">
              $0.50
            </span>
          </div>
          <div className="flex justify-between items-center" data-oid="cg-1qrm">
            <span className="text-gray-600" data-oid="5csy-7u">
              Merchant:
            </span>
            <span className="font-semibold text-indigo-700" data-oid=":suf-19">
              {merchantName}
            </span>
          </div>
        </div>
        <div className="relative w-32 h-32 mx-auto mb-6" data-oid=":cqrrnw">
          <svg
            className="w-full h-full"
            transform="rotate(-90)"
            viewBox="0 0 36 36"
            data-oid="t2swab3"
          >
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              data-oid="dnnzo.z"
            />

            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              data-oid="-moxvn1"
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            data-oid="w_ghq0e"
          >
            <div className="text-center" data-oid="z6_d4al">
              <div
                className="text-2xl font-bold text-indigo-700"
                data-oid="18d1z9p"
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500" data-oid="2diyiam">
                remaining
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 mb-6" data-oid="p_i5bkw">
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
                data-oid="jbq..xo"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isActive ? "bg-gradient-to-r from-yellow-400 to-indigo-500 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  data-oid="txipe2l"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" data-oid="52ka_d6" />
                  ) : isActive ? (
                    <Loader2
                      className="w-5 h-5 animate-spin"
                      data-oid="j15rqn5"
                    />
                  ) : (
                    <StepIcon className="w-5 h-5" data-oid="5urqsxs" />
                  )}
                </div>
                <span
                  className={`font-medium ${isActive ? "text-indigo-700" : isCompleted ? "text-green-700" : "text-gray-600"}`}
                  data-oid="0lu_mkz"
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="bg-gradient-to-r from-yellow-100 to-indigo-100 rounded-2xl p-4 text-center"
          data-oid="tlvan:a"
        >
          <p className="text-sm text-gray-700" data-oid="8dgdqrz">
            <span className="font-semibold" data-oid="nu__gpj">
              💡 Did you know?
            </span>
            <br data-oid="m8h1j-1" />
            Your transaction is protected by bank-level encryption!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionTracker;
