
import React, { useState } from 'react';
import { CreditCard, Scan, Eye, EyeOff, ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import QRScanner from '@/components/scanner/QRScanner';
import ScannerOverlay from '@/components/scanner/ScannerOverlay';
import PinInput from '@/components/payment/PinInput';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const StudentBalance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [error, setError] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [showBalanceAmount, setShowBalanceAmount] = useState(false);

  const handleScanResult = (result: string) => {
    try {
      console.log('Student QR Scan result:', result);
      const data = JSON.parse(result);
      setScannedData(data);
      setIsScanning(false);
      setError('');
    } catch (err) {
      console.log('QR Parse error:', err);
      // If not JSON, treat as simple string data
      setScannedData({
        studentName: 'Student User',
        studentId: result,
        cardNumber: '****1234'
      });
      setIsScanning(false);
      setError('');
    }
  };

  const handleScanError = (error: Error) => {
    console.log('Scanner error:', error);
    setError(t('cameraAccessFailed'));
    setTimeout(() => setError(''), 5000);
  };

  const handleCheckBalance = () => {
    if (!scannedData) return;
    setShowPinInput(true);
  };

  const handlePinConfirm = (pin: string) => {
    console.log('PIN confirmed for balance check:', pin);
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
    setError('');
    setBalance('');
    setShowBalanceAmount(false);
  };

  if (showBalance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScanner}
              className="text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Button>
            <LanguageSwitcher />
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              Student
            </Badge>
          </div>

          {/* Balance Display */}
          <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-emerald-800 flex items-center justify-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Balance Retrieved</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Info */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="text-emerald-600 font-medium">{t('name')}:</span>
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    {scannedData?.studentName || 'John Doe'}
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">{t('id')}:</span>
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    {scannedData?.studentId || 'STU001'}
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-lg font-semibold">Card Balance</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalanceAmount(!showBalanceAmount)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalanceAmount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="text-3xl font-bold">
                  {showBalanceAmount ? `$${balance}` : '****'}
                </div>
                <div className="text-emerald-100 text-sm mt-2">
                  Available Balance
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={resetScanner}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with Language Switcher */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <LanguageSwitcher />
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Student
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Check Balance</h1>
          <p className="text-emerald-600">Scan your student card to check balance</p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanner Card */}
        {!scannedData && (
          <Card className="mb-6 border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-emerald-800 flex items-center justify-center space-x-2">
                <Scan className="w-5 h-5" />
                <span>Card Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto border-4 border-dashed border-emerald-300 rounded-lg flex items-center justify-center bg-emerald-50">
                    <Smartphone className="w-12 h-12 text-emerald-400" />
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <QRScanner
                    onScan={handleScanResult}
                    onError={handleScanError}
                  />
                  <ScannerOverlay />
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setIsScanning(false)}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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
          <Card className="mb-6 border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Card Detected</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-emerald-600 font-medium">{t('name')}:</span>
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    {scannedData.studentName || 'John Doe'}
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">{t('id')}:</span>
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    {scannedData.studentId || 'STU001'}
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">Card:</span>
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    {scannedData.cardNumber || '****1234'}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCheckBalance}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  Check Balance
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  {t('reset')}
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
        />
      </div>
    </div>
  );
};

export default StudentBalance;
