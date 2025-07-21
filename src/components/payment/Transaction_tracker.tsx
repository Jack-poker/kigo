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

  const txid = new URLSearchParams(window.location.search).get("txid");
  const amount = new URLSearchParams(window.location.search).get("amount_data");


const TransactionTracker: React.FC<TransactionTrackerProps> = ({
  onComplete,
  transactionAmount = amount,
  merchantName = "Payment",
  transactionId=txid,
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
        "https://automation.kaascan.com/webhook/checkpaymentstatus",
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
      data-oid=":fg6spo"
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
        data-oid="he24o7u"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce"
          data-oid="o9us_y_"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="a-3kxfa"
          >
            <AlertCircle
              className="w-10 h-10 text-red-500"
              data-oid="cxibgs9"
            />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            data-oid="tmnguod"
          >
            Transaction Error
          </h2>
          <p className="text-gray-600 mb-4" data-oid="8up4g0e">
            No transaction ID provided. Please start a new payment from the
            dashboard.
          </p>
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
            onClick={() => (window.location.href = "/dashboard")}
            type="button"
            data-oid="jfghegt"
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
        data-oid="lzhj0fe"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          data-oid="g8cs6gt"
        >
          <div
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="lybw:t9"
          >
            <XCircle className="w-10 h-10 text-red-500" data-oid="v107o5s" />
          </div>
          <h2
            className="text-2xl font-bold text-white mb-2"
            data-oid="h143ryq"
          >
            Transaction Failed
          </h2>
          <p className="text-white-600 mb-4" data-oid="90i5icl">
            {error ||
              `Your payment of ${transactionAmount} to ${merchantName} was unsuccessful.`}
          </p>
          <div className="flex justify-center gap-4" data-oid="r--hj:l">
            <button
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
              onClick={handleRetry}
              type="button"
              data-oid="773w9j_"
            >
              Retry
            </button>
            <button
              className="bg-brand text-white px-6 py-3 rounded-full font-semibold shadow hover:from-gray-600 hover:to-gray-700 transition bg-[#000000F2]"
              onClick={() => (window.location.href = "/dashboard")}
              type="button"
              data-oid="vk75992"
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
        className="min-h-screen  flex items-center justify-center p-4"
        data-oid="djptbk5"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          data-oid="spccqad"
        >
          <div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            data-oid="9y3g.lk"
          >
            <CheckCircle
              className="w-10 h-10 text-white"
              data-oid="pg6s2qv"
            />
          </div>
          <h2
            className="text-2xl font-bold text-white mb-2"
            data-oid="23m.-w2"
          >
            Transaction Complete!
          </h2>
          <p className="text-gray-600 mb-4" data-oid="3153v-8">
            Your payment of {transactionAmount} to {merchantName} was
            successful.
          </p>
          <button
            className="bg-brand text-white px-6 py-3 rounded-full font-semibold shadow hover:from-green-600 hover:to-indigo-700 transition"
            onClick={() => (window.location.href = "/dashboard?refresh=true")}
            type="button"
            data-oid="3j8h_c6"
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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      data-oid="n-b2:-m"
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} data-oid="2j426yf" />
      ))}
      <div
        className="bg-zinc-900 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10"
        data-oid="dzqzq.q"
      >
        <div className="text-center mb-8" data-oid="-9q-eqd">
          <div
            className="w-16 h-16 
             rounded-full flex items-center justify-center mx-auto mb-4
             bg-brand"
            data-oid="3r5i2oj"
          >
            <Clock className="w-8 h-8 text-white" data-oid="ud3:6t9" />
          </div>
          <h1
            className="text-2xl font-bold text-yellow-400 mb-2"
            data-oid="gn0axhx"
          >
            Processing Your Transaction
          </h1>
          <p className="text-white" data-oid="uyk4dw8">
            Please wait while we securely process your payment
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2" data-oid="o.aegj.">
              {error}
            </p>
          )}
        </div>
        <div
          className="bg-zinc-to-r from-yellow-50 to-brand-50 rounded-2xl p-4 mb-6"
          data-oid="nqfkx35"
        >
          <div
            className="flex justify-between items-center mb-2"
            data-oid="atfol9g"
          >
            <span className="text-white" data-oid="5tjpb45">
              Amount:
            </span>
            <span
              className="font-bold text-lg text-white"
              data-oid=".qkj7rg"
            >
              {transactionAmount}
            </span>
          </div>
          <div
            className="flex justify-between items-center mb-2"
            data-oid="g5.m6tq"
          >
            <span className="text-white" data-oid=":bttihk">
              Transaction Fee:
            </span>
            <span className="font-semibold text-white" data-oid="ql5adv6">
              0.0
            </span>
          </div>
          <div className="flex justify-between items-center" data-oid="jj1dq-o">
            <span className="text-white" data-oid=":vt7_5h">
              Merchant:
            </span>
            <span className="font-semibold text-white" data-oid="m692kan">
              {merchantName}
            </span>
          </div>
        </div>
        <div className="relative w-32 h-32 mx-auto mb-6" data-oid="vejs7y-">
            <svg
            className="w-full h-full"
            transform="rotate(-90)"
            viewBox="0 0 36 36"
            data-oid="580:dfs"
            >
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              data-oid="bpsyezh"
            />

            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3b82f6" // Tailwind blue-500
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              data-oid="gxe9e.t"
            />
            </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            data-oid="c4njt9m"
          >
            <div className="text-center" data-oid="y-l..b8">
              <div
                className="text-2xl font-bold text-white"
                data-oid="ltklbhl"
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm white" data-oid="5mddcho">
                remaining
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 mb-6" data-oid="nmlxicp">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center p-3 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-none border-1 border-white"
                    : isCompleted
                      ? "bg-zinc-300 border border-green-200"
                      : "bg-gray-50 border  border-gray-200"
                }`}
                data-oid="ozze76_"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                     mr-3 ${isActive ? "bg-brand text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  data-oid="f01hd6p"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" data-oid="nx48up-" />
                  ) : isActive ? (
                    <Loader2
                      className="w-5 h-5 animate-spin"
                      data-oid="diktjg1"
                    />
                  ) : (
                    <StepIcon className="w-5 h-5" data-oid="8snfm.y" />
                  )}
                </div>
                <span
                  className={`font-medium ${isActive ? "text-white" : isCompleted ? "text-green-700" : "text-gray-600"}`}
                  data-oid="zyxyb:r"
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="bg-zinc-to-r from-yellow-100 to-indigo-100 rounded-2xl p-4 text-center"
          data-oid="3x9yt48"
        >
            <p className="text-sm text-white" data-oid="bp6.b.c">
            <span className="font-semibold" data-oid="o73kx_n">
              💡 Did you know?
            </span>
            <br data-oid="1s28oed" />
            Your payment is safe and secure!
            </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionTracker;
