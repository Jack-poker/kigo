
import React from 'react';
import { CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TransactionSuccessProps {
  onReset: () => void;
  scannedData: any;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ onReset, scannedData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800 mb-2">
              Payment Successful!
            </CardTitle>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Transaction Completed
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-600">Student:</span>
                  <span className="font-semibold text-emerald-800">
                    {scannedData?.studentName || 'John Doe'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Amount:</span>
                  <span className="font-bold text-emerald-800 text-lg">
                    ${scannedData?.amount || '50.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Transaction ID:</span>
                  <span className="font-mono text-emerald-800 text-xs">
                    TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Time:</span>
                  <span className="text-emerald-800">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Animation */}
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-green-600 animate-fade-in">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-sm font-medium">Money transferred successfully</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onReset}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Scan Another QR Code
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionSuccess;
