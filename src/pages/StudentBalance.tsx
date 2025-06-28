import React, { useState } from "react";
import {
  CreditCard,
  Scan,
  Eye,
  EyeOff,
  ArrowLeft,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import QRScanner from "@/components/scanner/QRScanner";
import ScannerOverlay from "@/components/scanner/ScannerOverlay";
import PinInput from "@/components/payment/PinInput";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const StudentBalance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [error, setError] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [showBalanceAmount, setShowBalanceAmount] = useState(false);

  const handleScanResult = (result: string) => {
    try {
      console.log("Student QR Scan result:", result);
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
        cardNumber: "****1234",
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

  const handleCheckBalance = () => {
    if (!scannedData) return;
    setShowPinInput(true);
  };

  const handlePinConfirm = (pin: string) => {
    console.log("PIN confirmed for balance check:", pin);
    setIsProcessing(true);

    // Simulate balance checking
    setTimeout(() => {
      setIsProcessing(false);
      setShowPinInput(false);
      // Simulate random balance
      const randomBalance = (Math.random() * 500 + 50).toFixed(2);
      setBalance(randomBalance);
      setShowBalance(true);
    }, 2000);
  };

  const resetScanner = () => {
    setScannedData(null);
    setShowBalance(false);
    setShowPinInput(false);
    setError("");
    setBalance("");
    setShowBalanceAmount(false);
  };

  if (showBalance) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4"
        data-oid="wyg1b6v"
      >
        <div className="max-w-md mx-auto" data-oid="3buowo3">
          {/* Header */}
          <div
            className="flex items-center justify-between mb-6"
            data-oid="5f.6vvm"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScanner}
              className="text-emerald-700 hover:text-emerald-800"
              data-oid="9nztb:t"
            >
              <ArrowLeft className="w-4 h-4 mr-2" data-oid="vuw9zbd" />
              {t("back")}
            </Button>
            <LanguageSwitcher data-oid="opvg43j" />
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800"
              data-oid="s9iqqt0"
            >
              Student
            </Badge>
          </div>

          {/* Balance Display */}
          <Card
            className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
            data-oid="7thzk31"
          >
            <CardHeader className="text-center" data-oid="7n3esbj">
              <CardTitle
                className="text-emerald-800 flex items-center justify-center space-x-2"
                data-oid="0dk5rkw"
              >
                <CheckCircle
                  className="w-6 h-6 text-green-600"
                  data-oid="9x1yqxm"
                />

                <span data-oid="g2ctd0r">Balance Retrieved</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="gjk2br5">
              {/* Student Info */}
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="6u7l1c_">
                <div
                  className="grid grid-cols-2 gap-2 text-sm mb-4"
                  data-oid="6klbet8"
                >
                  <div data-oid="_sp9cto">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="urg6w4x"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="6m7cmqm"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </div>
                  <div data-oid="_bv_mct">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="8-27jje"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="au8sq0d"
                  >
                    {scannedData?.studentId || "STU001"}
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div
                className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-xl text-white shadow-lg"
                data-oid="vhdcqui"
              >
                <div
                  className="flex items-center justify-between mb-4"
                  data-oid="oxhv6_l"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="1-2xezg"
                  >
                    <CreditCard className="w-6 h-6" data-oid="suww87." />
                    <span className="text-lg font-semibold" data-oid="3i:s-mr">
                      Card Balance
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalanceAmount(!showBalanceAmount)}
                    className="text-white hover:bg-white/20"
                    data-oid="pcq1o-5"
                  >
                    {showBalanceAmount ? (
                      <EyeOff className="w-4 h-4" data-oid="qfsgbs4" />
                    ) : (
                      <Eye className="w-4 h-4" data-oid="xfypgp9" />
                    )}
                  </Button>
                </div>
                <div className="text-3xl font-bold" data-oid="0hr2cjq">
                  {showBalanceAmount ? `$${balance}` : "****"}
                </div>
                <div
                  className="text-emerald-100 text-sm mt-2"
                  data-oid="6g1dv5q"
                >
                  Available Balance
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2" data-oid="mkhftmu">
                <Button
                  onClick={resetScanner}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="_bb.0um"
                >
                  Check Another Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4"
      data-oid="1artnh8"
    >
      <div className="max-w-md mx-auto" data-oid="341pbsz">
        {/* Header with Language Switcher */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="sf--h0n"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-emerald-700 hover:text-emerald-800"
            data-oid="rdxbcm9"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="j0frxus" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="-bxdkwk" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
            data-oid="m8948pi"
          >
            Student
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8" data-oid="imx:izv">
          <div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            data-oid="3hwakab"
          >
            <CreditCard className="w-8 h-8 text-white" data-oid=":kp_4pd" />
          </div>
          <h1
            className="text-3xl font-bold text-emerald-800 mb-2"
            data-oid="_j82rwg"
          >
            Check Balance
          </h1>
          <p className="text-emerald-600" data-oid="y16cxc6">
            Scan your student card to check balance
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card
            className="mb-6 border-red-200 bg-red-50 animate-fade-in"
            data-oid="axqve_x"
          >
            <CardContent className="p-4" data-oid="icyg9kr">
              <div className="flex items-center space-x-2" data-oid="nspc5wc">
                <AlertCircle
                  className="w-5 h-5 text-red-600"
                  data-oid="5-o8x9k"
                />

                <span className="text-red-700" data-oid="wajie6c">
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
            data-oid="voy:o0-"
          >
            <CardHeader className="text-center" data-oid="8.cqy.i">
              <CardTitle
                className="text-emerald-800 flex items-center justify-center space-x-2"
                data-oid="pv9dmi5"
              >
                <Scan className="w-5 h-5" data-oid="orx.92e" />
                <span data-oid="pnk7h:f">Card Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="-ywdi2-">
              {!isScanning ? (
                <div className="text-center space-y-4" data-oid="-9go2it">
                  <div
                    className="w-32 h-32 mx-auto border-4 border-dashed border-emerald-300 rounded-lg flex items-center justify-center bg-emerald-50"
                    data-oid="8zny5-."
                  >
                    <Smartphone
                      className="w-12 h-12 text-emerald-400"
                      data-oid="0f79k67"
                    />
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-oid="af7mlh_"
                  >
                    <Scan className="w-5 h-5 mr-2" data-oid="6x33548" />
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="relative" data-oid="bciu4_:">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                    data-oid="ay232f6"
                  />

                  <ScannerOverlay data-oid="miqk0l7" />
                  <div className="mt-4 text-center" data-oid="xg8cqhe">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      data-oid="rc802te"
                    >
                      Cancel Scan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scanned Card Display */}
        {scannedData && (
          <Card
            className="mb-6 border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
            data-oid="h0brasi"
          >
            <CardHeader data-oid="_hsvn4y">
              <CardTitle
                className="text-emerald-800 flex items-center space-x-2"
                data-oid="7.lbxg5"
              >
                <CheckCircle
                  className="w-5 h-5 text-green-600"
                  data-oid="suei2dk"
                />

                <span data-oid=":6dndpw">Card Detected</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="v7qo.6i">
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="gtk7pw-">
                <div
                  className="grid grid-cols-2 gap-2 text-sm"
                  data-oid="190tg-q"
                >
                  <div data-oid="as3yyn2">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="ykkutsx"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="-.859jf"
                  >
                    {scannedData.studentName || "John Doe"}
                  </div>
                  <div data-oid="_.twc0f">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="szqni-3"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="_3oa7rh"
                  >
                    {scannedData.studentId || "STU001"}
                  </div>
                  <div data-oid="gvvvjjf">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="ivp2:m0"
                    >
                      Card:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="4246b_-"
                  >
                    {scannedData.cardNumber || "****1234"}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2" data-oid="q4cfql7">
                <Button
                  onClick={handleCheckBalance}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="5t9hl7n"
                >
                  Check Balance
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  data-oid="z81calg"
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
          data-oid="9:jgsc_"
        />
      </div>
    </div>
  );
};

export default StudentBalance;
