import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import VercelModal from "./VercelModal";
import { CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"


const WithdrawModal = ({ t, setActiveModal, isLoading, balance }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [requestLoading, setRequestLoading] = useState(false); // Loading for OTP request
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading for confirm withdraw
  const inputRefs = useRef([]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    const newOtp = ["", "", "", ""];
    for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 3)].focus();
    }
  };

  // Get CSRF token
  const getCsrfToken = async () => {
    const response = await axios.get("https://api.kaascan.com/get-csrf-token");
    return response.data.csrf_token;
  };

  // Request OTP from backend
  const handleRequestOtp = async () => {
    setError("");
    if (!phone || !/^\d{10}$/.test(phone)) {
      setError(t("invalidPhone"));
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || numericAmount < 100 || numericAmount > balance) {
      setError(t("invalidAmount"));
      return;
    }
    try {
      setRequestLoading(true);
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        "https://api.kaascan.com/wallet/request-otp",
        { phone, amount: numericAmount, csrf_token: csrfToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
        },
      );
      if (response.data.status === "pending_otp") {
        setOtpRequested(true);
        setCountdown(300);
      } else {
        setError(t("otpRequestFailed"));
      }
    } catch (error) {
      setError(error.response?.data?.detail || t("otpRequestFailed"));
    } finally {
      setRequestLoading(false);
    }
  };

  // Confirm withdrawal
  const handleConfirmWithdraw = async () => {
    const otpCode = otp.join("");
    if (!otpRequested) {
      setError(t("requestOtpFirst"));
      return;
    }
    if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
      setError(t("invalidPin"));
      return;
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      setError(t("invalidPhone"));
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || numericAmount < 100 || numericAmount > balance) {
      setError(t("invalidAmount"));
      return;
    }
    try {
      setConfirmLoading(true);
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        "https://api.kaascan.com/wallet/confirm-withdraw",
        {
          phone,
          amount: numericAmount,
          otp_code: otpCode,
          csrf_token: csrfToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
        },
      );
      if (response.data.status === "success") {
        setActiveModal(null); // Close modal on success
      } else {
        setError(t("withdrawFailed"));
      }
    } catch (error) {
      setError(error.response?.data?.detail || t("withdrawFailed"));
    } finally {
      setConfirmLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    let timer;
    if (otpRequested && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setOtpRequested(false);
            setOtp(["", "", "", ""]);
            setError(t("otpExpired"));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpRequested, countdown, t]);

  // Format countdown time
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle form submission
  const onSubmit = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (!otpRequested) {
      handleRequestOtp();
    } else {
      handleConfirmWithdraw();
    }
  };

  return (
    <VercelModal
      title={t("withdraw")}
      onClose={() => setActiveModal(null)}
      onSubmit={onSubmit}
      isLoading={isLoading || requestLoading || confirmLoading}
      submitText={otpRequested ? t("confirmWithdraw") : t("requestOtp")}
      data-oid="snicnmw"
    >
      <form className="space-y-6" onSubmit={onSubmit} data-oid=".8.5krw">
        <div data-oid="f4nv844">
          <label
            className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
            data-oid="5i6v:te"
          >
            {t("phoneNumber")} <Badge variant="outline" className="gap-1">
                <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
                Genzura nimero wanditse neza
              </Badge>
          </label>
          
          <input
            type="tel"
            name="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpRequested || requestLoading || confirmLoading}
            className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            placeholder="078XXXXXXX"
            data-oid="2wj9b40"
          />
        </div>
        <div data-oid="l19x5w:">
          <label
            className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
            data-oid="u4p8m_6"
          >
            {t("amount")}
          </label>
          <input
            type="number"
            name="amount"
            required
            min="100"
            max={balance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={otpRequested || requestLoading || confirmLoading}
            className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            placeholder="100"
            data-oid="n8p9qkw"
          />
        </div>
        {otpRequested && (
          <>
            <div data-oid="rld.bbs">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="2kw9hjn"
              >
                {t("pin")}
              </label>
              <div
                className="flex space-x-2"
                onPaste={handlePaste}
                data-oid="6o0ovua"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-xl rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    data-oid="obja_r4"
                  />
                ))}
              </div>
            </div>
            <div
              className="text-sm text-brand dark:text-green-300"
              data-oid="3nrx1:d"
            >
              {t("otpExpiresIn")} {formatCountdown()}
            </div>
          </>
        )}
        {error && (
          <div
            className={`text-sm mt-2 px-3 py-2 rounded-xl transition-all duration-300 ${
              error
                ? "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white shadow-lg"
                : "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white shadow-lg"
            }`}
            data-oid="rc4wd7m"
          >
            {error ? (
              <>
                <span role="img" aria-label="alert">
                  ⚡
                </span>{" "}
                {error}
              </>
            ) : (
              <>
                <span role="img" aria-label="success">
                  🎉
                </span>{" "}
                {t("allGood")}
              </>
            )}
          </div>
        )}
      </form>
    </VercelModal>
  );
};

export default WithdrawModal;