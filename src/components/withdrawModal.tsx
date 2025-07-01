import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import VercelModal from "./VercelModal";

const WithdrawModal = ({ t, setActiveModal, isLoading, balance }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
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
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        "http://localhost:8001/wallet/request-otp",
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
    }
  };

  // Get CSRF token
  const getCsrfToken = async () => {
    const response = await axios.get("http://localhost:8001/get-csrf-token");
    return response.data.csrf_token;
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
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        "http://localhost:8001/wallet/confirm-withdraw",
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
      isLoading={isLoading}
      data-oid="1o33.hz"
      submitText={otpRequested ? t("confirmWithdraw") : t("requestOtp")}
    >
      <form className="space-y-6" data-oid="g:yps14" onSubmit={onSubmit}>
        <div data-oid="m2_2zlh">
          <label
            className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
            data-oid="13rdapu"
          >
            {t("phoneNumber")}
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpRequested}
            className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            placeholder="078XXXXXXX"
            data-oid="p0x8q1m"
          />
        </div>
        <div data-oid="0:oi69p">
          <label
            className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
            data-oid="7pw8f9z"
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
            disabled={otpRequested}
            className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            placeholder="10,000"
            data-oid="d_a:7ro"
          />
        </div>
        {otpRequested && (
          <>
            <div data-oid="4sp3784">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="_xx0h:_"
              >
                {t("pin")}
              </label>
              <div
                className="flex space-x-2"
                onPaste={handlePaste}
                data-oid="2mkkca7"
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
                    data-oid={`d6--rta-${index}`}
                  />
                ))}
              </div>
            </div>
            <div
              className="text-sm text-brand dark:text-green-300"
              data-oid="countdown"
            >
              {t("otpExpiresIn")} {formatCountdown()}
            </div>
          </>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2" data-oid="error_msg">
            {error}
          </div>
        )}
      </form>
    </VercelModal>
  );
};

export default WithdrawModal;
