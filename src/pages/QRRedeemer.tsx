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
        data-oid="qnlz-:_"
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
      data-oid=".__by33"
    >
      <div className="max-w-md mx-auto" data-oid="-3ck9y.">
        {/* Header with Language Switcher */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="97nhw5u"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-emerald-700 hover:text-brand"
            data-oid="e8zsasj"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="a2lp:vr" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="4qcr7kc" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-brand"
            data-oid="b5pp60w"
          >
            {t("moneyReceiver")}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8" data-oid="s76o616">
          <div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            data-oid="yr2q6md"
          >
            <QrCodeIcon className="w-8 h-8 text-white" data-oid="8ld_o7i" />
          </div>
          <h1 className="text-3xl font-bold text-brand mb-2" data-oid="_pj2_qb">
            {t("qrRedeemer")}
          </h1>
          <p className="text-emerald-600" data-oid="haoscz7">
            {t("scanStudentQR")}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card
            className="mb-6 border-red-200 bg-red-50 animate-fade-in"
            data-oid="fbkxldh"
          >
            <CardContent className="p-4" data-oid="1mqbc6q">
              <div className="flex items-center space-x-2" data-oid="6a1fswm">
                <AlertCircle
                  className="w-5 h-5 text-red-600"
                  data-oid="gq6r6fn"
                />

                <span className="text-red-700" data-oid="npkls73">
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
            data-oid="co7ubwi"
          >
            <CardHeader className="text-center" data-oid="afkz7bu">
              <CardTitle
                className="text-brand flex items-center justify-center space-x-2"
                data-oid="8s2cctg"
              >
                <Scan className="w-5 h-5" data-oid="lete45a" />
                <span className="text-brand" data-oid="kyeqamn">
                  {t("qrCodeScanner")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="36-1w8.">
              {!isScanning ? (
                <div className="text-center space-y-4" data-oid="f2txlsy">
                  <div
                    className="w-80 h-80 mx-auto  flex items-center justify-center "
                    data-oid="2mr8t.7"
                  >
                    {/* <Smartphone className="w-12 h-12 text-brand" /> */}
                    <div
                      className={`flex flex-col items-center justify-center text-center text-sm ${1 ? "text-emerald-200" : "text-emerald-600"}`}
                      data-oid="wdsp4js"
                    >
                      <div
                        className="w-45 h-45 mx-auto mb-2"
                        data-oid="0nizo6b"
                      >
                        <img
                          src="/assets/Scan to pay-amico.svg"
                          alt="No ads illustration"
                          className="w-full h-full object-contain"
                          draggable={false}
                          data-oid="l9n6dnu"
                        />
                      </div>
                      <p
                        className="text-zinc-900 font-medium mb-2"
                        data-oid="od.zr:."
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
                      <br data-oid="c2y2ely"></br>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-brand  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-oid="a76uh88"
                  >
                    <Scan className="w-5 h-5 mr-2" data-oid="esot0ys" />
                    {t("startScanning")}
                  </Button>
                </div>
              ) : (
                <div className="relative" data-oid=".kl5tb1">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                    data-oid="9r9k-ir"
                  />

                  <ScannerOverlay data-oid="_kubo6p" />
                  <div className="mt-4 text-center" data-oid="7ovx6y.">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700"
                      data-oid="0shnvxs"
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
            data-oid="9vhsehn"
          >
            <CardHeader data-oid=":d9pblx">
              <CardTitle
                className="text-brand flex items-center space-x-2"
                data-oid="nonhbm."
              >
                <CheckCircle
                  className="w-5 h-5 text-green-600"
                  data-oid="b_zir_a"
                />

                <span data-oid=":p4kv4w">{t("studentDetails")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="93oipz5">
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="v4tss-n">
                <div
                  className="grid grid-cols-2 gap-2 text-sm"
                  data-oid="5bj12gl"
                >
                  <div data-oid="n03tn-d">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="7nazu1a"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div className="text-brand font-semibold" data-oid="dj8u09w">
                    {scannedData.studentName || "John Doe"}
                  </div>
                  <div data-oid="1ar51ti">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="tjqe1jt"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div className="text-brand font-semibold" data-oid="fhg1fro">
                    {scannedData.studentId || "STU001"}
                  </div>
                  <div data-oid=":if52wp">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="wk77t-p"
                    >
                      {t("amount")}:
                    </span>
                  </div>
                  <div
                    className="text-brand font-bold text-lg"
                    data-oid="oj4fgir"
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
                data-oid="xivot2y"
              />

              <div className="flex space-x-2" data-oid="qkzxbvy">
                <Button
                  onClick={handlePayment}
                  disabled={
                    !selectedGateway || !phoneNumber || phoneNumber.length < 10
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="uzc0hm5"
                >
                  {t("processPayment")}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 "
                  data-oid="2h019--"
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
          data-oid="q3-:akl"
        />
      </div>
    </div>
  );
};

export default QRRedeemer;
