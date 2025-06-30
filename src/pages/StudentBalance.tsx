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
        data-oid=".16ye3:"
      >
        <div className="max-w-md mx-auto" data-oid="3.6htcm">
          {/* Header */}
          <div
            className="flex items-center justify-between mb-6"
            data-oid="qz3:v60"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScanner}
              className="text-emerald-700 hover:text-emerald-800"
              data-oid="f4_j0va"
            >
              <ArrowLeft className="w-4 h-4 mr-2" data-oid="qy2z_00" />
              {t("back")}
            </Button>
            <LanguageSwitcher data-oid="ywh5gzm" />
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800"
              data-oid="azgr5v9"
            >
              Student
            </Badge>
          </div>

          {/* Balance Display */}
          <Card
            className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
            data-oid="uxzlxp1"
          >
            <CardHeader className="text-center" data-oid="0rtj-ci">
              <CardTitle
                className="text-emerald-800 flex items-center justify-center space-x-2"
                data-oid="-_.a.x9"
              >
                <CheckCircle
                  className="w-6 h-6 text-green-600"
                  data-oid="3vcwc8o"
                />

                <span data-oid="enevh0v">Balance Retrieved</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="z0cb_6i">
              {/* Student Info */}
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="3yb7:wq">
                <div
                  className="grid grid-cols-2 gap-2 text-sm mb-4"
                  data-oid="08ekgls"
                >
                  <div data-oid="0-jqtv4">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="jcitsly"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="7eg4gu2"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </div>
                  <div data-oid="zaxpw9.">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="uc1xir7"
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="p451v4l"
                  >
                    {scannedData?.studentId || "STU001"}
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div
                className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-xl text-white shadow-lg"
                data-oid="nxhjpf3"
              >
                <div
                  className="flex items-center justify-between mb-4"
                  data-oid="m4b2k3i"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="tguaebs"
                  >
                    <CreditCard className="w-6 h-6" data-oid="kyr7dx8" />
                    <span className="text-lg font-semibold" data-oid="iy846bs">
                      Card Balance
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalanceAmount(!showBalanceAmount)}
                    className="text-white hover:bg-white/20"
                    data-oid="x9p_82y"
                  >
                    {showBalanceAmount ? (
                      <EyeOff className="w-4 h-4" data-oid="nuwz6ee" />
                    ) : (
                      <Eye className="w-4 h-4" data-oid="8ohzxrr" />
                    )}
                  </Button>
                </div>
                <div className="text-3xl font-bold" data-oid=".1-93g7">
                  {showBalanceAmount ? `$${balance}` : "****"}
                </div>
                <div
                  className="text-emerald-100 text-sm mt-2"
                  data-oid="f10nxk6"
                >
                  Available Balance
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2" data-oid="0eia9ey">
                <Button
                  onClick={resetScanner}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="kvi0ykm"
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
      data-oid="-mfqvp2"
    >
      <div className="max-w-md mx-auto" data-oid="ag5b-sg">
        {/* Header with Language Switcher */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="z7k01p4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-emerald-700 hover:text-emerald-800"
            data-oid="okwa8rq"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="u0kpsth" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="24zammc" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
            data-oid="26mn::g"
          >
            Student
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8" data-oid="juv5jms">
          <div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            data-oid="fwg_9mz"
          >
            <CreditCard className="w-8 h-8 text-white" data-oid="ddwpj-t" />
          </div>
          <h1
            className="text-3xl font-bold text-emerald-800 mb-2"
            data-oid="j7ybd6z"
          >
            Check Balance
          </h1>
          <p className="text-emerald-600" data-oid="n6ei:j0">
            Scan your student card to check balance
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card
            className="mb-6 border-red-200 bg-red-50 animate-fade-in"
            data-oid=".c1h93i"
          >
            <CardContent className="p-4" data-oid="jfb9pcs">
              <div className="flex items-center space-x-2" data-oid="26uau1z">
                <AlertCircle
                  className="w-5 h-5 text-red-600"
                  data-oid="37cvd-."
                />

                <span className="text-red-700" data-oid="9e2ng-t">
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
            data-oid="d3e2r1n"
          >
            <CardHeader className="text-center" data-oid="hzz188o">
              <CardTitle
                className="text-emerald-800 flex items-center justify-center space-x-2"
                data-oid="cidh508"
              >
                <Scan className="w-5 h-5" data-oid=".n2x907" />
                <span data-oid="-tmv4jh">Card Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="-:34x0.">
              {!isScanning ? (
                <div className="text-center space-y-4" data-oid="if9zk6v">
                  <div
                    className="w-32 h-32 mx-auto border-4 border-dashed border-emerald-300 rounded-lg flex items-center justify-center bg-emerald-50"
                    data-oid="qclmiic"
                  >
                    <Smartphone
                      className="w-12 h-12 text-emerald-400"
                      data-oid="93vmceo"
                    />
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-oid="vo3yjrd"
                  >
                    <Scan className="w-5 h-5 mr-2" data-oid="2m7:08g" />
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="relative" data-oid="78yt9u_">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                    data-oid="8q:.k_s"
                  />

                  <ScannerOverlay data-oid="ov9f6cp" />
                  <div className="mt-4 text-center" data-oid="lnizl5e">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      data-oid="03izkil"
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
            data-oid="ti23ci-"
          >
            <CardHeader data-oid="wuh8m:m">
              <CardTitle
                className="text-emerald-800 flex items-center space-x-2"
                data-oid="a5zj-lb"
              >
                <CheckCircle
                  className="w-5 h-5 text-green-600"
                  data-oid="z4_em9b"
                />

                <span data-oid="lw:e0mc">Card Detected</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="fw2:dim">
              <div className="bg-emerald-50 p-4 rounded-lg" data-oid="sbyg6ay">
                <div
                  className="grid grid-cols-2 gap-2 text-sm"
                  data-oid="h0_eo1d"
                >
                  <div data-oid="6l6r580">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="x0ep2dc"
                    >
                      {t("name")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="5-esvkk"
                  >
                    {scannedData.studentName || "John Doe"}
                  </div>
                  <div data-oid="pqkrs88">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="xqzu.v."
                    >
                      {t("id")}:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="b-:nx7t"
                  >
                    {scannedData.studentId || "STU001"}
                  </div>
                  <div data-oid="gov_v0f">
                    <span
                      className="text-emerald-600 font-medium"
                      data-oid="6j0p:76"
                    >
                      Card:
                    </span>
                  </div>
                  <div
                    className="text-emerald-800 font-semibold"
                    data-oid="lv16_al"
                  >
                    {scannedData.cardNumber || "****1234"}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2" data-oid="jx3d.lv">
                <Button
                  onClick={handleCheckBalance}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                  data-oid="zzv37e3"
                >
                  Check Balance
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  data-oid="g0:vxf8"
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
          data-oid="v31fbg5"
        />
      </div>
    </div>
  );
};

export default StudentBalance;
