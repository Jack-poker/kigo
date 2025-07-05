import React from "react";
import { CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TransactionSuccessProps {
  onReset: () => void;
  scannedData: any;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
  onReset,
  scannedData,
}) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center"
      data-oid="yoxgxk-"
    >
      <div className="max-w-md w-full" data-oid=".m5l:kp">
        <Card
          className="border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm animate-scale-in"
          data-oid="62rgz91"
        >
          <CardHeader className="text-center pb-4" data-oid="ufa0.8w">
            <div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce"
              data-oid="xa--.n0"
            >
              <CheckCircle
                className="w-10 h-10 text-white"
                data-oid="gadoyk0"
              />
            </div>
            <CardTitle
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid="0.eovko"
            >
              Payment Successful!
            </CardTitle>
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100"
              data-oid="21rvtb_"
            >
              Transaction Completed
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6" data-oid="hrm507v">
            {/* Transaction Details */}
            <div
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-200"
              data-oid="3ldwt.f"
            >
              <h3
                className="font-semibold text-emerald-800 mb-3"
                data-oid="z6yz_sd"
              >
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm" data-oid="t1ovv:5">
                <div className="flex justify-between" data-oid="185qs8r">
                  <span className="text-emerald-600" data-oid="j22kj.:">
                    Student:
                  </span>
                  <span
                    className="font-semibold text-emerald-800"
                    data-oid="guwtw7q"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="9m4-p60">
                  <span className="text-emerald-600" data-oid="19vz7ew">
                    Amount:
                  </span>
                  <span
                    className="font-bold text-emerald-800 text-lg"
                    data-oid="i-273io"
                  >
                    ${scannedData?.amount || "50.00"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="pj66.ma">
                  <span className="text-emerald-600" data-oid="g6pf84n">
                    Transaction ID:
                  </span>
                  <span
                    className="font-mono text-emerald-800 text-xs"
                    data-oid="5e_w3r3"
                  >
                    TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="xirza:e">
                  <span className="text-emerald-600" data-oid="9mka1rf">
                    Time:
                  </span>
                  <span className="text-emerald-800" data-oid="7h7u7h.">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Animation */}
            <div className="text-center py-4" data-oid="j0gmrig">
              <div
                className="inline-flex items-center space-x-2 text-green-600 animate-fade-in"
                data-oid="r1:0ghh"
              >
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="6-_7sh7"
                ></div>
                <span className="text-sm font-medium" data-oid=".e61mcu">
                  Money transferred successfully
                </span>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="2ys2504"
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3" data-oid="-dc6tmn">
              <Button
                onClick={onReset}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                data-oid="oeeay.3"
              >
                <RefreshCw className="w-5 h-5 mr-2" data-oid="tkko1lz" />
                Scan Another QR Code
              </Button>

              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                onClick={() => window.print()}
                data-oid="8r.uayp"
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
