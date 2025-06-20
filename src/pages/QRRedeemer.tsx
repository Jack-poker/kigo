
import React, { useState } from 'react';
import { QrCodeIcon, Scan, CheckCircle, AlertCircle, ArrowLeft, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import QRScanner from '@/components/scanner/QRScanner';
import PaymentGatewaySelector from '@/components/payment/PaymentGatewaySelector';
import ScannerOverlay from '@/components/scanner/ScannerOverlay';
import TransactionSuccess from '@/components/payment/TransactionSuccess';
import PinInput from '@/components/payment/PinInput';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const QRRedeemer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handleScanResult = (result: string) => {
    try {
      console.log('QR Scan result:', result);
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
        amount: '50.00'
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

  const handlePayment = () => {
    if (!selectedGateway || !scannedData || !phoneNumber) return;
    
    if (phoneNumber.length < 10) {
      setError(t('validPhoneNumber'));
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setShowPinInput(true);
  };

  const handlePinConfirm = (pin: string) => {
    console.log('PIN confirmed:', pin);
    console.log('Payment details:', { gateway: selectedGateway, phone: phoneNumber });
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
    setSelectedGateway('');
    setPhoneNumber('');
    setTransactionComplete(false);
    setShowPinInput(false);
    setError('');
  };

  if (transactionComplete) {
    return <TransactionSuccess onReset={resetScanner} scannedData={scannedData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4" style={{      backgroundImage: "url('/assets/background.png')",
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto'}}>
      <div className="max-w-md mx-auto">
        {/* Header with Language Switcher */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-emerald-700 hover:text-brand"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <LanguageSwitcher />
          <Badge variant="secondary" className="bg-emerald-100 text-brand">
            {t('moneyReceiver')}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <QrCodeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand mb-2">{t('qrRedeemer')}</h1>
          <p className="text-emerald-600">{t('scanStudentQR')}</p>
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
              <CardTitle className="text-brand flex items-center justify-center space-x-2">
                <Scan className="w-5 h-5" />
                <span className='text-brand'>{t('qrCodeScanner')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center space-y-4">
                  <div className="w-80 h-80 mx-auto  flex items-center justify-center ">
                    {/* <Smartphone className="w-12 h-12 text-brand" /> */}
                       <div className={`flex flex-col items-center justify-center text-center text-sm ${1 ? 'text-emerald-200' : 'text-emerald-600'}`}>
              <div className="w-45 h-45 mx-auto mb-2">
              <img
                src="/assets/Scan to pay-amico.svg"
                alt="No ads illustration"
                className="w-full h-full object-contain"
                draggable={false}
              />
              </div>
              <p className="text-zinc-900 font-medium mb-2">
                {t('scanGuide', {
                  defaultValue: 'Hold the student\'s QR code inside the frame above. Once scanned, you\'ll see their details and can proceed to payment.'
                })}
              </p>
              {/* <p className="text-emerald-600 text-xs">
                {t('payGuide', {
                  defaultValue: 'After scanning, select a payment method, enter your phone number, and follow the prompts to complete the transaction.'
                })}
              </p> */}
              <br></br>
            </div>
                  </div>
                  <Button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-brand  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    {t('startScanning')}
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
                      className="border-emerald-300 text-emerald-700"
                    >
                      {t('cancelScan')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scanned Data Display */}
        {scannedData && (
          <Card className="mb-6 border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="text-brand flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>{t('studentDetails')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-emerald-600 font-medium">{t('name')}:</span>
                  </div>
                  <div className="text-brand font-semibold">
                    {scannedData.studentName || 'John Doe'}
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">{t('id')}:</span>
                  </div>
                  <div className="text-brand font-semibold">
                    {scannedData.studentId || 'STU001'}
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">{t('amount')}:</span>
                  </div>
                  <div className="text-brand font-bold text-lg">
                    ${scannedData.amount || '50.00'}
                  </div>
                </div>
              </div>
              
              <PaymentGatewaySelector
                selectedGateway={selectedGateway}
                onGatewaySelect={setSelectedGateway}
                phoneNumber={phoneNumber}
                onPhoneNumberChange={setPhoneNumber}
              />

              <div className="flex space-x-2">
                <Button
                  onClick={handlePayment}
                  disabled={!selectedGateway || !phoneNumber || phoneNumber.length < 10}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600  text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  {t('processPayment')}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-emerald-300 text-emerald-700 "
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

export default QRRedeemer;
