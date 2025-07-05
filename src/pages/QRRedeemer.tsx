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
        data-oid="rj1mt71"
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
      data-oid="q_gddp0"
    >
      <div className="max-w-md mx-auto" data-oid="c1w8xvi">
        {/* Header with Language Switcher */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="7:nts60"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-emerald-700 hover:text-brand"
            data-oid="tiwk12d"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="tt4bulu" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="ofpo_-p" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-brand"
            data-oid=".nfgsm2"
          >
            {t("moneyReceiver")}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8" data-oid="vnjgut:">
          <div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            data-oid="ezs5oa0"
          >
            <QrCodeIcon className="w-8 h-8 text-white" data-oid="1f-:xze" />
          </div>
          <h1 className="text-3xl font-bold text-brand mb-2" data-oid="tb4jy8a">
            {t("qrRedeemer")}
          </h1>
          <p className="text-emerald-600" data-oid="acsegbz">
            {t("scanStudentQR")}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card
            className="mb-6 border-red-200 bg-red-50 animate-fade-in"
            data-oid="3r62bax"
          >
            <CardContent className="p-4" data-oid="ecy4fsa">
              <div className="flex items-center space-x-2" data-oid="wib_t.t">
                <AlertCircle
                  className="w-5 h-5 text-red-600"
                  data-oid="j4q9h63"
                />

                <span className="text-red-700" data-oid="2mybip7">
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
            data-oid="s4.zw:s"
          >
            <CardHeader className="text-center" data-oid="pdi-qd7">
              <CardTitle
                className="text-brand flex items-center justify-center space-x-2"
                data-oid="m3m1a26"
              >
                <Scan className="w-5 h-5" data-oid="gq7e9g8" />
                <span className="text-brand" data-oid="18o9ob6">
                  {t("qrCodeScanner")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="7bbfggs">
              {!isScanning ? (
                <div className="text-center space-y-4" data-oid="sr.y_:e">
                  <div
                    className="w-80 h-80 mx-auto  flex items-center justify-center "
                    data-oid=":5h0jy:"
                  >
                    {/* <Smartphone className="w-12 h-12 text-brand" /> */}
                    <div
                      className={`flex flex-col items-center justify-center text-center text-sm ${1 ? "text-emerald-200" : "text-emerald-600"}`}
                      data-oid="l2-luzq"
                    >
                      <div
                        className="w-45 h-45 mx-auto mb-2"
                        data-oid="ginuzl9"
                      >
                        <img
                          src="/assets/Scan to pay-amico.svg"
                          alt="No ads illustration"
                          className="w-full h-full object-contain"
                          draggable={false}
                          data-oid="wit4::p"
                        />
                      </div>
                      <p
                        className="text-zinc-900 font-medium mb-2"
                        data-oid="pu.7kyg"
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
                      <br data-oid="nj7wij9"></br>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-brand  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-oid="0c93nyf"
                  >
                    <Scan className="w-5 h-5 mr-2" data-oid="8y0qdga" />
                    {t("startScanning")}
                  </Button>
                </div>
              ) : (
                <div className="relative" data-oid="lk98lub">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                    data-oid="q6jmk:1"
                  />

                  <ScannerOverlay data-oid="tg42bii" />
                  <div className="mt-4 text-center" data-oid="i7lix_6">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700"
                      data-oid="qlvymdn"
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
            data-oid="xm5y5i8"
          >
            <CardHeader data-oid="uzb0i5z">
              <CardTitle
                className="text-brand flex items-center space-x-2"
                data-oid="lw-9gsk"
              >
                <CheckCircle
                  className="w-5 h-5 text-green-600"
                  data-oid="sp5sxa7"
                />

                <span data-oid="186pc.w">{t("studentDetails")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="g1.4jrw">
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="nf240uq">
                <div
                  className="grid grid-cols-2 gap-2 text-sm"
                  data-oid="yhdaaii"
                >
                  <div data-oid="s-smjrg">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="dk1202y"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div className="text-brand font-semibold" data-oid="dmb1mi.">
                    {scannedData.studentName || "John Doe"}
                  </div>
                  <div data-oid=".8_wn::">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="bnzpqve"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div className="text-brand font-semibold" data-oid="26od8id">
                    {scannedData.studentId || "STU001"}
                  </div>
                  <div data-oid="335kbu9">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="16xpwf5"
                    >
                      {t("amount")}:
                    </span>
                  </div>
                  <div
                    className="text-brand font-bold text-lg"
                    data-oid="uglcp8x"
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
                data-oid="fu0n6jy"
              />

              <div className="flex space-x-2" data-oid="a4xbct8">
                <Button
                  onClick={handlePayment}
                  disabled={
                    !selectedGateway || !phoneNumber || phoneNumber.length < 10
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="1.txq6j"
                >
                  {t("processPayment")}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 "
                  data-oid="oq:mv3y"
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
          data-oid=":9uxx:t"
        />
      </div>
    </div>
  );
};

export default QRRedeemer;
