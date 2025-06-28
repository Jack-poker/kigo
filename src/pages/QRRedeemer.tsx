import React, { useState } from "react";
import {
  QrCodeIcon,
  Scan,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import QRScanner from "@/components/scanner/QRScanner";
import PaymentGatewaySelector from "@/components/payment/PaymentGatewaySelector";
import ScannerOverlay from "@/components/scanner/ScannerOverlay";
import TransactionSuccess from "@/components/payment/TransactionSuccess";
import PinInput from "@/components/payment/PinInput";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const QRRedeemer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPinInput, setShowPinInput] = useState(false);

  const handleScanResult = (result: string) => {
    try {
      console.log("QR Scan result:", result);
      const data = JSON.parse(result);
      setScannedData(data);
      setIsScanning(false);
      setError("");
    } catch (err) {
      console.log("QR Parse error:", err);
      // If not JSON, treat as simple string data
      setScannedData({
        studentName: "Student User",
        studentId: result,
        amount: "50.00",
      });
      setIsScanning(false);
      setError("");
    }
  };

  const handleScanError = (error: Error) => {
    console.log("Scanner error:", error);
    setError(t("cameraAccessFailed"));
    setTimeout(() => setError(""), 5000);
  };

  const handlePayment = () => {
    if (!selectedGateway || !scannedData || !phoneNumber) return;

    if (phoneNumber.length < 10) {
      setError(t("validPhoneNumber"));
      setTimeout(() => setError(""), 3000);
      return;
    }

    setShowPinInput(true);
  };

  const handlePinConfirm = (pin: string) => {
    console.log("PIN confirmed:", pin);
    console.log("Payment details:", {
      gateway: selectedGateway,
      phone: phoneNumber,
    });
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowPinInput(false);
      setTransactionComplete(true);
    }, 3000);
  };

  const resetScanner = () => {
    setScannedData(null);
    setSelectedGateway("");
    setPhoneNumber("");
    setTransactionComplete(false);
    setShowPinInput(false);
    setError("");
  };

  if (transactionComplete) {
    return (
      <TransactionSuccess
        onReset={resetScanner}
        scannedData={scannedData}
        data-oid="xy3e4ga"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
      data-oid="ahunhv7"
    >
      <div className="max-w-md mx-auto" data-oid="7fe0qa:">
        {/* Header with Language Switcher */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="8.tgxrk"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-emerald-700 hover:text-brand"
            data-oid="s:u2fhy"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="-7jnx4w" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="w1d7h:l" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-brand"
            data-oid="3yy8w:m"
          >
            {t("moneyReceiver")}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8" data-oid="9pxswcs">
          <div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            data-oid="b.5wema"
          >
            <QrCodeIcon className="w-8 h-8 text-white" data-oid="tux_u24" />
          </div>
          <h1 className="text-3xl font-bold text-brand mb-2" data-oid="onrqhtb">
            {t("qrRedeemer")}
          </h1>
          <p className="text-emerald-600" data-oid="e8hw:y.">
            {t("scanStudentQR")}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card
            className="mb-6 border-red-200 bg-red-50 animate-fade-in"
            data-oid="5c.2rsk"
          >
            <CardContent className="p-4" data-oid="wlfi5ei">
              <div className="flex items-center space-x-2" data-oid="y33guzy">
                <AlertCircle
                  className="w-5 h-5 text-red-600"
                  data-oid="xhdzqe-"
                />

                <span className="text-red-700" data-oid="gkp.ucd">
                  {error}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanner Card */}
        {!scannedData && (
          <Card
            className="mb-6 border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm"
            data-oid="cp1ni-i"
          >
            <CardHeader className="text-center" data-oid="p_xhxsy">
              <CardTitle
                className="text-brand flex items-center justify-center space-x-2"
                data-oid="qmr1tlc"
              >
                <Scan className="w-5 h-5" data-oid="g49neea" />
                <span className="text-brand" data-oid="-0s0oz.">
                  {t("qrCodeScanner")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="gfk5bi3">
              {!isScanning ? (
                <div className="text-center space-y-4" data-oid="p78_f0f">
                  <div
                    className="w-80 h-80 mx-auto  flex items-center justify-center "
                    data-oid=":6p1ku4"
                  >
                    {/* <Smartphone className="w-12 h-12 text-brand" /> */}
                    <div
                      className={`flex flex-col items-center justify-center text-center text-sm ${1 ? "text-emerald-200" : "text-emerald-600"}`}
                      data-oid="3.py8ug"
                    >
                      <div
                        className="w-45 h-45 mx-auto mb-2"
                        data-oid="lcqdy66"
                      >
                        <img
                          src="/assets/Scan to pay-amico.svg"
                          alt="No ads illustration"
                          className="w-full h-full object-contain"
                          draggable={false}
                          data-oid="g_l1ybs"
                        />
                      </div>
                      <p
                        className="text-zinc-900 font-medium mb-2"
                        data-oid="hhnw-xx"
                      >
                        {t("scanGuide", {
                          defaultValue:
                            "Hold the student's QR code inside the frame above. Once scanned, you'll see their details and can proceed to payment.",
                        })}
                      </p>
                      {/* <p className="text-emerald-600 text-xs">
                    {t('payGuide', {
                    defaultValue: 'After scanning, select a payment method, enter your phone number, and follow the prompts to complete the transaction.'
                    })}
                    </p> */}
                      <br data-oid="fbk1t78"></br>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-brand  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-oid="xozfdke"
                  >
                    <Scan className="w-5 h-5 mr-2" data-oid=":3h-32c" />
                    {t("startScanning")}
                  </Button>
                </div>
              ) : (
                <div className="relative" data-oid="mppiplg">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                    data-oid="enobyct"
                  />

                  <ScannerOverlay data-oid="6e2z0ep" />
                  <div className="mt-4 text-center" data-oid="ke4wt6w">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700"
                      data-oid="kjjpzt5"
                    >
                      {t("cancelScan")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scanned Data Display */}
        {scannedData && (
          <Card
            className="mb-6 border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
            data-oid="-ywj3xp"
          >
            <CardHeader data-oid="-6dpt0w">
              <CardTitle
                className="text-brand flex items-center space-x-2"
                data-oid="wkcqq2t"
              >
                <CheckCircle
                  className="w-5 h-5 text-green-600"
                  data-oid="eajapg0"
                />

                <span data-oid="4x1uhx:">{t("studentDetails")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="3ibpwyg">
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="18wq.t6">
                <div
                  className="grid grid-cols-2 gap-2 text-sm"
                  data-oid="57omzv4"
                >
                  <div data-oid="m7dxxml">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="0zrchp1"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div className="text-brand font-semibold" data-oid="in8io.-">
                    {scannedData.studentName || "John Doe"}
                  </div>
                  <div data-oid="nk-w6pd">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="ze0c.ig"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div className="text-brand font-semibold" data-oid="1uivxiz">
                    {scannedData.studentId || "STU001"}
                  </div>
                  <div data-oid="kizz67w">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="a5cfgwo"
                    >
                      {t("amount")}:
                    </span>
                  </div>
                  <div
                    className="text-brand font-bold text-lg"
                    data-oid="anu18sk"
                  >
                    ${scannedData.amount || "50.00"}
                  </div>
                </div>
              </div>

              <PaymentGatewaySelector
                selectedGateway={selectedGateway}
                onGatewaySelect={setSelectedGateway}
                phoneNumber={phoneNumber}
                onPhoneNumberChange={setPhoneNumber}
                data-oid="54s4l_o"
              />

              <div className="flex space-x-2" data-oid="21.j034">
                <Button
                  onClick={handlePayment}
                  disabled={
                    !selectedGateway || !phoneNumber || phoneNumber.length < 10
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="_7hsgkw"
                >
                  {t("processPayment")}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 "
                  data-oid="wnp6prq"
                >
                  {t("reset")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PIN Input Dialog */}
        <PinInput
          isOpen={showPinInput}
          onClose={() => setShowPinInput(false)}
          onConfirm={handlePinConfirm}
          isProcessing={isProcessing}
          data-oid="eqmub6u"
        />
      </div>
    </div>
  );
};

export default QRRedeemer;
