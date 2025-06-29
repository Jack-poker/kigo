import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Props interface
interface DepositStatusCheckerProps {
  transactionId?: string; // Transaction ID from URL or prop
  apiUrl: string; // Base API URL (e.g., http://localhost:8001)
  token: string | null; // JWT token from localStorage.getItem('token')
  t: (key: string) => string; // Translation function (e.g., react-i18next)
  onStatusChange: (status: string) => void; // Callback for status updates
}

const DepositStatusChecker: React.FC<DepositStatusCheckerProps> = ({
  transactionId,
  apiUrl = "http://localhost:8001",
  token = localStorage.getItem("token"),
  t,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const MAX_ATTEMPTS = 60; // 5 minutes at 5s intervals
  const POLLING_INTERVAL = 5000; // 5 seconds
  const RETRY_DELAY = 1000; // 1 second delay between retries
  const MAX_CSRF_RETRIES = 3;

  // Fetch CSRF token with retry logic
  const fetchCsrfToken = useCallback(
    async (retries = MAX_CSRF_RETRIES): Promise<string | null> => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await axios.get(`${apiUrl}/admin/get-csrf-token`, {
            withCredentials: true,
            timeout: 5000, // 5-second timeout for CSRF fetch
          });
          const csrf = response.data.csrf_token;
          console.log("CSRF Token fetched:", csrf);
          setCsrfToken(csrf);
          setError("");
          return csrf;
        } catch (err: any) {
          const errorMsg = err.response?.data?.detail || t("csrfTokenFailed");
          console.error(`CSRF token fetch failed (attempt ${attempt}):`, err);
          if (attempt === retries) {
            setError(t("csrfTokenFailed"));
            return null;
          }
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
      return null;
    },
    [apiUrl, t],
  );

  // Fetch transaction status
  const fetchStatus = useCallback(async () => {
    if (!csrfToken || !transactionId) return;
    try {
      const response = await axios.get(
        `${apiUrl}/transactions/${transactionId}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
          timeout: 5000, // 5-second timeout for status fetch
        },
      );
      const { status: newStatus } = response.data;
      setStatus(newStatus);
      setIsPolling(true);
      setAttempts((prev) => prev + 1);
      setError("");
      onStatusChange(newStatus);

      // Stop polling on terminal state
      if (newStatus === "success" || newStatus === "failed") {
        setIsPolling(false);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || t("statusFetchFailed");
      setError(errorMsg);
      console.error("Status fetch error:", err);
      setIsPolling(false);
      setStatus("failed");
      onStatusChange("failed");
    }
  }, [csrfToken, transactionId, token, apiUrl, t, onStatusChange]);

  // Initial validation and CSRF token fetch
  useEffect(() => {
    if (!transactionId) {
      setError(t("missingTransactionId"));
      setIsPolling(false);
      return;
    }
    if (!token) {
      setError(t("missingToken"));
      setIsPolling(false);
      return;
    }
    fetchCsrfToken();
  }, [transactionId, token, t, fetchCsrfToken]);

  // Polling logic
  useEffect(() => {
    if (
      csrfToken &&
      transactionId &&
      token &&
      attempts < MAX_ATTEMPTS &&
      !status
    ) {
      fetchStatus(); // Initial fetch
      const interval = setInterval(fetchStatus, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [csrfToken, transactionId, token, attempts, status, fetchStatus]);

  // Handle max attempts
  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS && !status) {
      setIsPolling(false);
      setError(t("maxAttemptsReached"));
      setStatus("failed");
      onStatusChange("failed");
    }
  }, [attempts, t, onStatusChange, status]);

  // Handle navigation to dashboard on error
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4"
      data-oid="be:dvju"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center"
        data-oid="f5zn2g1"
      >
        {error ? (
          <div className="flex flex-col items-center" data-oid="ppjg7nx">
            <XCircle
              className="w-12 h-12 text-red-500 mb-4"
              data-oid="dd8nufq"
            />

            <p
              className="text-red-600 text-lg font-semibold mb-2"
              data-oid="b6hcj20"
            >
              {t("transactionError")}
            </p>
            <p className="text-gray-600 mb-6" data-oid="_dgllyw">
              {error}
            </p>
            <button
              onClick={handleGoToDashboard}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
              data-oid="tff2k.o"
            >
              {t("goToDashboard")}
            </button>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col items-center" data-oid="m.fb9zo">
            <CheckCircle
              className="w-12 h-12 text-green-500 mb-4"
              data-oid="wly8rer"
            />

            <p
              className="text-green-600 text-lg font-semibold mb-2"
              data-oid="mdkxn8p"
            >
              {t("transactionSuccess")}
            </p>
            <p className="text-gray-600 mb-6" data-oid="rkl95sw">
              {t("depositConfirmed")}
            </p>
            <button
              onClick={handleGoToDashboard}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
              data-oid="y4hw16e"
            >
              {t("goToDashboard")}
            </button>
          </div>
        ) : status === "failed" ? (
          <div className="flex flex-col items-center" data-oid="fmuh-fn">
            <XCircle
              className="w-12 h-12 text-red-500 mb-4"
              data-oid="y2v4wpp"
            />

            <p
              className="text-red-600 text-lg font-semibold mb-2"
              data-oid="g.cqych"
            >
              {t("transactionFailed")}
            </p>
            <p className="text-gray-600 mb-6" data-oid="88zz-wz">
              {t("depositFailed")}
            </p>
            <button
              onClick={handleGoToDashboard}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
              data-oid="10l2jsk"
            >
              {t("goToDashboard")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center" data-oid="wogfbo2">
            <Loader2
              className="w-12 h-12 text-indigo-600 animate-spin mb-4"
              data-oid="_-1hge5"
            />

            <p
              className="text-indigo-600 text-lg font-semibold"
              data-oid="ryzrp_."
            >
              {t("checkingDepositStatus")}
            </p>
            <p className="text-gray-600" data-oid="bp4ok9u">
              {t("pleaseWait")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositStatusChecker;
