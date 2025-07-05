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
        data-oid="k8rcn-c"
      >
        <div className="max-w-md mx-auto" data-oid="_8lzoca">
          {/* Header */}
          <div
            className="flex items-center justify-between mb-6"
            data-oid="kkkfw-:"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScanner}
              className="text-emerald-700 hover:text-emerald-800"
              data-oid="efnm_8."
            >
              <ArrowLeft className="w-4 h-4 mr-2" data-oid="f9ps-r4" />
              {t("back")}
            </Button>
            <LanguageSwitcher data-oid="umid5wl" />
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800"
              data-oid="x596uxs"
            >
              Student
            </Badge>
          </div>

          {/* Balance Display */}
          <Card
            className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
            data-oid="4rmu-jg"
          >
            <CardHeader className="text-center" data-oid="xdrjp8d">
              <CardTitle
                className="text-emerald-800 flex items-center justify-center space-x-2"
                data-oid="cltnkvx"
              >
                <CheckCircle
                  className="w-6 h-6 text-green-600"
                  data-oid="hrm.-tx"
                />

                <span data-oid="dhbkwr_">Balance Retrieved</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="dqtohug">
              {/* Student Info */}
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="ka-cacv">
                <div
                  className="grid grid-cols-2 gap-2 text-sm mb-4"
                  data-oid="l4bc04a"
                >
                  <div data-oid="ckly_f5">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="_.okzbz"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="..qy9o9"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </div>
                  <div data-oid="f0:89c:">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="crd--6y"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="37m9gq6"
                  >
                    {scannedData?.studentId || "STU001"}
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div
                className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-xl text-white shadow-lg"
                data-oid="pes3fm:"
              >
                <div
                  className="flex items-center justify-between mb-4"
                  data-oid="wgrj6n3"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="qn4hi:t"
                  >
                    <CreditCard className="w-6 h-6" data-oid="xmuyv-_" />
                    <span className="text-lg font-semibold" data-oid="wqcd9h-">
                      Card Balance
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalanceAmount(!showBalanceAmount)}
                    className="text-white hover:bg-white/20"
                    data-oid="bw6-jgf"
                  >
                    {showBalanceAmount ? (
                      <EyeOff className="w-4 h-4" data-oid="._fkr0." />
                    ) : (
                      <Eye className="w-4 h-4" data-oid="39pwcln" />
                    )}
                  </Button>
                </div>
                <div className="text-3xl font-bold" data-oid=".1cnnds">
                  {showBalanceAmount ? `$${balance}` : "****"}
                </div>
                <div
                  className="text-emerald-100 text-sm mt-2"
                  data-oid="wvk356j"
                >
                  Available Balance
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2" data-oid="aiy7-8g">
                <Button
                  onClick={resetScanner}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="wtqg87:"
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
      data-oid="fh47pwq"
    >
      <div className="max-w-md mx-auto" data-oid="z.verz:">
        {/* Header with Language Switcher */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="rwnlmhb"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-emerald-700 hover:text-emerald-800"
            data-oid="658v5ex"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="tmmhrym" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="psvw60x" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
            data-oid="yaixfze"
          >
            Student
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8" data-oid="of4q5im">
          <div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            data-oid="nk2crf9"
          >
            <CreditCard className="w-8 h-8 text-white" data-oid=".u25h5v" />
          </div>
          <h1
            className="text-3xl font-bold text-emerald-800 mb-2"
            data-oid="xod24od"
          >
            Check Balance
          </h1>
          <p className="text-emerald-600" data-oid="gvm9ozy">
            Scan your student card to check balance
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card
            className="mb-6 border-red-200 bg-red-50 animate-fade-in"
            data-oid="d6kxdgo"
          >
            <CardContent className="p-4" data-oid="a7jfnn_">
              <div className="flex items-center space-x-2" data-oid="c4g87ps">
                <AlertCircle
                  className="w-5 h-5 text-red-600"
                  data-oid="18ku_79"
                />

                <span className="text-red-700" data-oid="pj.mmhk">
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
            data-oid=".nxclg1"
          >
            <CardHeader className="text-center" data-oid="ay7j870">
              <CardTitle
                className="text-emerald-800 flex items-center justify-center space-x-2"
                data-oid="7cg-sax"
              >
                <Scan className="w-5 h-5" data-oid="-hy45iv" />
                <span data-oid="7rpnbfv">Card Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="vrakjvl">
              {!isScanning ? (
                <div className="text-center space-y-4" data-oid="me:2gr2">
                  <div
                    className="w-32 h-32 mx-auto border-4 border-dashed border-emerald-300 rounded-lg flex items-center justify-center bg-emerald-50"
                    data-oid="7kv2ho."
                  >
                    <Smartphone
                      className="w-12 h-12 text-emerald-400"
                      data-oid="qp85yev"
                    />
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-oid="p88gn3u"
                  >
                    <Scan className="w-5 h-5 mr-2" data-oid="66cu939" />
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="relative" data-oid="7-xo7ii">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                    data-oid="q2:g_ii"
                  />

                  <ScannerOverlay data-oid="2_xpbks" />
                  <div className="mt-4 text-center" data-oid="91m_x85">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      data-oid="mbbp9a_"
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
            data-oid="xcrpudt"
          >
            <CardHeader data-oid="jucqb3r">
              <CardTitle
                className="text-emerald-800 flex items-center space-x-2"
                data-oid=".u9y.tc"
              >
                <CheckCircle
                  className="w-5 h-5 text-green-600"
                  data-oid="0-56f_7"
                />

                <span data-oid="zdsrqgr">Card Detected</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="6yt99bv">
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="0.cvbtk">
                <div
                  className="grid grid-cols-2 gap-2 text-sm"
                  data-oid="ogxw_zt"
                >
                  <div data-oid="spl0l4:">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="iva652r"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="omkpd34"
                  >
                    {scannedData.studentName || "John Doe"}
                  </div>
                  <div data-oid="4hng0sa">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="ylwq1zq"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="iu525u7"
                  >
                    {scannedData.studentId || "STU001"}
                  </div>
                  <div data-oid="e2lrxlu">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="ygvzfyj"
                    >
                      Card:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="adf:77m"
                  >
                    {scannedData.cardNumber || "****1234"}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2" data-oid="pk7geh_">
                <Button
                  onClick={handleCheckBalance}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="ayz_i_4"
                >
                  Check Balance
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  data-oid="t_qv41g"
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
          data-oid="0wn14x."
        />
      </div>
    </div>
  );
};

export default StudentBalance;
