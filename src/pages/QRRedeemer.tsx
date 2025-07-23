import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  QrCodeIcon,
  Scan,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Smartphone,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRScanner from "@/components/scanner/QRScanner";
import ScannerOverlay from "@/components/scanner/ScannerOverlay";
import TransactionSuccess from "@/components/payment/TransactionSuccess";
import PinInput from "@/components/payment/PinInput";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import Rheader from "@/components/ui/Reedmerheader";

const OnboardingSection = ({ t, error, phoneNumber, setPhoneNumber, handlePhoneSubmit }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      image: "/assets/3dphone.png",
      alt: "Phone illustration",
      text: t("takePhone", { defaultValue: "Fata telefone yawe" }),
    },
    {
      image: "/assets/dialpad.png",
      alt: "Dialpad illustration",
      text: t("enterPhone", { defaultValue: "Andika numero ya telefone hano" }),
    },
    {
      image: "/assets/mobile-payment-with-qr-code-shopping-bags.png",
      alt: "Phone illustration",
      text: t("takePhone", { defaultValue: "Fata telefone yawe" }),
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isPaused, slides.length]);

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6" role="dialog" aria-labelledby="onboarding_title">
      <div className="text-center">
        <div
          className="relative w-40 h-40 mx-auto mb-6"
          role="region"
          aria-label="Onboarding carousel"
          aria-live="polite"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              } ${index === activeSlide ? (index === 0 ? "animate-slide-in-left" : "animate-slide-in-right") : ""}`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-brand text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {slide.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                index === activeSlide ? "bg-brand" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="mb-6">
          <h2 id="onboarding_title" className="text-2xl font-bold text-brand mb-2">
            {t("welcome", { defaultValue: "Murakaza neza, Redeemer!" })}
          </h2>
          <p className="text-brand mb-2">
            {t("enterPhonePrompt", { defaultValue: "Injiza numero ya telefone kugirango utangire." })}
          </p>
          <p className="text-brand font-medium">
            {t("kinyarwandaGuide", { defaultValue: "Follow the steps to start receiving payments." })}
          </p>
        </div>
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-700 mb-4 animate-fade-in" role="alert">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>{error}</span>
        </div>
      )}
      <input
        type="tel"
        placeholder={t("phonePlaceholder", { defaultValue: "Enter your phone number" })}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-3 border border-brand rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        aria-label="Phone number"
      />
      <button
        onClick={handlePhoneSubmit}
        className="w-full mt-4 bg-brand text-white font-semibold px-3 py-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Save and continue"
      >
        {t("Emeza & Ukomeze", { defaultValue: "Save and Continue" })}
      </button>
    </div>
  );
};

const API_ENDPOINT = "https://auto.kaascan.com/webhook/reedem";
const TRANSFER_ENDPOINT = "http://localhost:8001/api/transfer";

const QRRedeemer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("redeemerPhone") || "");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [error, setError] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!phoneNumber);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showHero, setShowHero] = useState(!phoneNumber && !localStorage.getItem("redeemerPhone"));
  const scannerRef = useRef(null);
  const [studentName, setStudentName] = useState("");
  const [studentProfileImage, setStudentProfileImage] = useState(null);

  const checkCameraPermission = useCallback(async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: "camera" });
        setCameraPermission(permissionStatus.state);
        return permissionStatus.state === "granted";
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setCameraPermission("granted");
        return true;
      }
    } catch (err) {
      console.error("Camera permission check failed:", err);
      setCameraPermission(err.name === "NotAllowedError" ? "denied" : "prompt");
      return false;
    }
  }, []);

  const handlePhoneSubmit = useCallback(() => {
    if (phoneNumber.length < 10) {
      setError(t("validPhoneNumber", { defaultValue: "Please enter a valid phone number" }));
      setTimeout(() => setError(""), 3000);
      return;
    }
    localStorage.setItem("redeemerPhone", phoneNumber);
    setShowOnboarding(false);
    setShowHero(false);
    setError("");
  }, [phoneNumber, t]);

  const handleGetStarted = useCallback(() => {
    if (phoneNumber) {
      setShowHero(false);
      startScanning();
    } else {
      setShowOnboarding(true);
      setShowHero(false);
    }
  }, [phoneNumber]);

  const handleScanResult = useCallback(
    async (result) => {
      try {
        console.log("QR Scan result:", result);
        let data;
        try {
          data = JSON.parse(result);
        } catch {
          data = { studentName: "Student User", studentId: result, profileImage: null };
        }
        try {
          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrData: data, timestamp: new Date().toISOString() }),
          });
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          const apiResponse = await response.json();
          console.log("API response:", apiResponse);
          if (apiResponse.success) {
            setStudentName(apiResponse.data["student_name"]);
            setStudentProfileImage(apiResponse.data["profile_photo"] || "/assets/default-profile.png");
            setScannedData({ ...data, transactionId: apiResponse.transactionId || null });
            setIsScanning(false);
            setIsCameraLoading(false);
            setError("");
          } else {
            throw new Error(apiResponse.message || t("invalidQRCode", { defaultValue: "Invalid QR Code" }));
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          setError(t("apiRequestFailed", { defaultValue: "Failed to validate QR code" }));
          setTimeout(() => setError(""), 5000);
          setIsScanning(false);
          setIsCameraLoading(false);
        }
      } catch (err) {
        console.log("QR Parse error:", err);
        setScannedData({ studentName: "Student User", studentId: result, profileImage: null });
        setStudentProfileImage("/assets/default-profile.png");
        setStudentName("Student User");
        setIsScanning(false);
        setIsCameraLoading(false);
        setError("");
      }
    },
    [t]
  );

  const handleScanError = useCallback(
    (error) => {
      console.error("Scanner error:", error);
      let errorMessage = t("cameraAccessFailed", { defaultValue: "Failed to access camera" });
      if (error.name === "NotAllowedError") {
        errorMessage = t("cameraPermissionDenied", { defaultValue: "Camera access denied. Please allow camera access in your browser settings." });
      } else if (error.name === "NotFoundError") {
        errorMessage = t("noCameraFound", { defaultValue: "No camera found on this device. Please use a device with a camera." });
      } else if (error.name === "NotReadableError") {
        errorMessage = t("cameraInUse", { defaultValue: "Camera is in use by another application. Please close it and try again." });
      } else if (error.name === "NotFoundException2") {
        return;
      }
      setError(errorMessage);
      setTimeout(() => setError(""), 7000);
      setIsScanning(false);
      setIsCameraLoading(false);
    },
    [t]
  );

  const startScanning = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (hasPermission) {
      setIsScanning(true);
      setIsCameraLoading(true);
    } else {
      setError(t("cameraPermissionRequired", { defaultValue: "Camera access is required to scan QR codes. Please allow camera access." }));
      setTimeout(() => setError(""), 7000);
    }
  }, [checkCameraPermission, t]);

  useEffect(() => {
    if (isScanning) {
      setIsCameraLoading(true);
      const timer = setTimeout(() => setIsCameraLoading(false), 1000);
      console.log("Scanner initialized");
      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.stop();
          console.log("Scanner cleanup");
        }
      };
    }
  }, [isScanning]);

  const handlePayment = useCallback(async () => {
    if (!phoneNumber || phoneNumber.length < 10 || !amount || parseFloat(amount) <= 0 || !scannedData) {
      setError(t("completeFields", { defaultValue: "Please enter a valid phone number and amount" }));
      setTimeout(() => setError(""), 3000);
      return;
    }
    setShowPinInput(true);
  }, [phoneNumber, amount, scannedData, t]);

  const handlePinConfirm = useCallback(
    async (pin) => {
      console.log("PIN confirmed:", pin);
      console.log("Transfer details:", { studentId: scannedData?.studentId, phone: phoneNumber, amount, pin });
      if (!scannedData?.studentId || !phoneNumber || !amount || !pin) {
        setError(t("missingFields", { defaultValue: "Please provide all required fields: student ID, phone number, amount, and PIN" }));
        setTimeout(() => setError(""), 5000);
        setIsProcessing(false);
        setShowPinInput(false);
        return;
      }
      setIsProcessing(true);
      try {
        console.log("Request headers:", { "Content-Type": "application/json" });
        console.log("Request body:", {
          studentId: scannedData.studentId,
          amount: parseFloat(amount),
          phoneNumber,
          pin,
          timestamp: new Date().toISOString(),
        });
        const response = await fetch(TRANSFER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: scannedData.studentId, // use snake_case if backend expects it
            amount: parseFloat(amount),
            phone_number: phoneNumber,
            pin: pin,
            timestamp: new Date().toISOString(),
          }),
        });
        if (!response.ok) {
          throw new Error(`Transfer request failed with status ${response.status}`);
        }
        const transferResponse = await response.json();
        if (transferResponse.success) {
          setIsProcessing(false);
          setShowPinInput(false);
          setTransactionComplete(true);
        } else {
          throw new Error(transferResponse.message || t("transferFailed", { defaultValue: "Transfer request failed" }));
        }
      } catch (transferError) {
        console.error("Transfer error:", transferError);
        setError(t("transferFailed", { defaultValue: "Failed to process transfer: " + transferError.message }));
        setTimeout(() => setError(""), 5000);
        setIsProcessing(false);
        setShowPinInput(false);
      }
    },
    [scannedData, phoneNumber, amount, t]
  );

  const resetScanner = useCallback(() => {
    setScannedData(null);
    setAmount("");
    setPin("");
    setTransactionComplete(false);
    setShowPinInput(false);
    setError("");
    setStudentProfileImage(null);
    setStudentName("");
  }, []);

  // Footer component
  const Footer = () => (
    <footer className="w-full bg-white py-6 mt-8" role="contentinfo" aria-label="Footer">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-brand mb-4">{t("trustedBy", { defaultValue: "Trusted By" })}</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <img
                src="/assets/mtn.png"
                alt="mtn logo"
                className="h-20 transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
              <img
                src="/assets/airtel.png"
                alt="airtel logo"
                className="h-20 transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
              <img
                src="/assets/tigo.png"
                alt="tigo logo"
                className="h-20 transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-brand mb-4">{t("quickLinks", { defaultValue: "Quick Links" })}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-brand hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Home"
                >
                  {t("home", { defaultValue: "Home" })}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/learn-more")}
                  className="text-brand hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Learn More"
                >
                  {t("learnMore", { defaultValue: "Learn More" })}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-brand hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Contact"
                >
                  {t("contact", { defaultValue: "Contact" })}
                </button>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold text-brand mb-4">{t("contactUs", { defaultValue: "Contact Us" })}</h3>
            <p className="text-brand">
              <a
                href="mailto:support@linkedstudents.com"
                className="hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Email support"
              >
                support@kaascan.com
              </a>
            </p>
            <div className="mt-4 text-xs text-gray-500">
              Powered by <span className="font-semibold text-brand">Kaascan</span>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-brand">
          <p>© {new Date().getFullYear()} Kaascan. {t("allRightsReserved", { defaultValue: "All rights reserved." })}</p>
        </div>
      </div>
    </footer>
  );

  if (showHero) {
    return (
      <div
        className="min-h-screen flex flex-col bg-brand"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
          backgroundBlendMode: "overlay,overlay,overlay,normal",
        }}
      >
        <div className="flex-1">
          {/* <Rheader /> */}
          <div className="relative w-full overflow-hidden py-16">
            <div className="container relative mx-auto max-w-7xl px-4">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="flex flex-col text-center md:text-left">
                  <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                    Receive Payments with <span className="bg-gradient-to-r from-white via-white-300 to-white-200 bg-clip-text text-transparent">LinkedStudents</span>
                  </h2>
                  <p className="mb-8 text-lg leading-relaxed text-white/80">
                    Easily accept payments from students using QR codes. Fast, secure, and seamless for shops and redeemers.{' '}
                    <span className="font-semibold text-white">Start now!</span>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                    <button
                      onClick={handleGetStarted}
                      className="relative rounded-full bg-white px-6 py-3 text-brand font-semibold shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="Get started"
                    >
                      Get Started
                      <Sparkles className="h-4 w-4 inline ml-2" />
                    </button>
                    <button
                      onClick={() => navigate("/learn-more")}
                      className="relative rounded-full border border-emerald-300/50 px-6 py-3 text-white font-semibold transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="Learn more"
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4 inline" />
                    </button>
                  </div>
                  <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
                    {['Fast Payments', 'Secure QR Codes', 'Shop Friendly'].map((feature) => (
                      <div
                        key={feature}
                        className="relative rounded-full px-4 py-1.5 text-sm font-medium text-white bg-emerald-500/20 border border-emerald-300/30 transition-transform duration-300 hover:scale-105"
                      >
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative mx-auto flex justify-center">
                  <div className="max-w-[420px] animate-scale-in">
                    <img
                      src="/assets/mobile-payment-with-qr-code-shopping-bags.png"
                      alt="QR payment illustration"
                      className="w-full"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div
        className="min-h-screen flex flex-col bg-brand"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
          backgroundBlendMode: "overlay,overlay,overlay,normal",
        }}
      >
        <div className="flex-1 flex items-center justify-center p-4">
          <OnboardingSection
            t={t}
            error={error}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handlePhoneSubmit={handlePhoneSubmit}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (transactionComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-brand">
        <div className="flex-1">
          <TransactionSuccess onReset={resetScanner} scannedData={{ ...scannedData, amount }} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-brand"
      style={{
        backgroundImage:
          "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
    >
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center text-white hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Back to admin"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>{t("back", { defaultValue: "Back" })}</span>
            </button>
            <LanguageSwitcher className="text-white" />
            <span className="bg-white text-brand px-3 py-1 rounded-full text-sm font-medium">
              {t("moneyReceiver", { defaultValue: "Money Receiver" })}
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <QrCodeIcon className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("qrRedeemer", { defaultValue: "QR Redeemer" })}</h1>
            <p className="text-white/80">{t("scanStudentQR", { defaultValue: "Scan the student’s QR code to proceed" })}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in" role="alert">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>{error}</span>
              </div>
              {error.includes("camera") && (
                <button
                  onClick={startScanning}
                  className="mt-2 w-full border border-emerald-300 text-emerald-700 py-2 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Retry camera access"
                >
                  {t("retryCamera", { defaultValue: "Retry Camera Access" })}
                </button>
              )}
            </div>
          )}

          {!scannedData && (
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6" role="region" aria-labelledby="scanner_title">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Scan className="w-5 h-5 text-brand" />
                  <h2 id="scanner_title" className="text-xl font-bold text-brand">
                    {t("qrCodeScanner", { defaultValue: "QR Code Scanner" })}
                  </h2>
                </div>
                <p className="text-brand text-large mb-4">
                  {t("payGuide", {
                    defaultValue: "Scan the student’s QR code, specify the amount to receive the payment.",
                  })}
                </p>
              </div>
              {!isScanning ? (
                <div className="text-center space-y-4">
                  <div className="w-80 h-80 mx-auto flex items-center justify-center">
                    <div className="flex flex-col items-center text-center text-sm text-brand">
                      <img
                        src="/assets/mobile-payment-with-qr-code-shopping-bags.png"
                        alt="Scan to pay illustration"
                        className="w-50 h-50 mb-4"
                        draggable={false}
                      />
                      {cameraPermission === "denied" && (
                        <p className="text-red-600 text-xs mt-2">
                          {t("cameraPermissionDenied", { defaultValue: "Camera access denied. Please enable it in your browser settings." })}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={startScanning}
                    disabled={cameraPermission === "denied"}
                    className="w-full bg-brand text-white font-semibold py-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Start scanning"
                  >
                    <Scan className="w-5 h-5 mr-2 inline" />
                    {t("startScanning", { defaultValue: "Start Scanning" })}
                  </button>
                </div>
              ) : (
                <div className="relative">
                  {isCameraLoading ? (
                    <div className="w-80 h-80 mx-auto flex items-center justify-center bg-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-brand">
                        <div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                        <p>{t("loadingCamera", { defaultValue: "Loading camera..." })}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <QRScanner ref={scannerRef} onScan={handleScanResult} onError={handleScanError} />
                      <ScannerOverlay />
                    </>
                  )}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsScanning(false)}
                      className="w-full border border-emerald-300 text-emerald-700 py-2 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="Cancel scan"
                    >
                      {t("cancelScan", { defaultValue: "Cancel Scan" })}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {scannedData && (
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 animate-scale-in" role="region" aria-labelledby="details_title">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-brand" />
                <h2 id="details_title" className="text-xl font-bold text-brand">
                  {t("studentDetails", { defaultValue: "Student Details" })}
                </h2>
              </div>
              <div className="bg-white border border-brand p-4 rounded-lg mb-4">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={studentProfileImage}
                    alt={`${studentName}'s profile`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-brand shadow-md mb-2"
                    draggable={false}
                  />
                  <span className="text-brand font-medium text-lg">{studentName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-brand font-medium">{t("id", { defaultValue: "ID" })}:</span>
                  <span className="text-brand font-semibold">{scannedData.studentId || "STU001"}</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <label className="text-brand font-medium" htmlFor="amount_input">
                  {t("amountToReceive", { defaultValue: "Amount to Receive ($)" })}
                </label>
                <input
                  id="amount_input"
                  type="number"
                  placeholder={t("enterAmount", { defaultValue: "Enter amount" })}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-brand rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  min="0"
                  step="0.01"
                  aria-label="Amount to receive"
                />
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handlePayment}
                  disabled={!phoneNumber || phoneNumber.length < 10 || !amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-brand text-white font-semibold py-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Process payment"
                >
                  {t("processPayment", { defaultValue: "Process Payment" })}
                </button>
                <button
                  onClick={resetScanner}
                  className="px-4 border border-brand text-brand py-3 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Reset"
                >
                  {t("reset", { defaultValue: "Reset" })}
                </button>
              </div>
            </div>
          )}

          <PinInput
            isOpen={showPinInput}
            onClose={() => setShowPinInput(false)}
            onConfirm={handlePinConfirm}
            isProcessing={isProcessing}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(QRRedeemer);