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
      data-oid="tiezoa7"
    >
      <div className="max-w-md w-full" data-oid="fy:1t9r">
        <Card
          className="border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm animate-scale-in"
          data-oid="9hpr_b8"
        >
          <CardHeader className="text-center pb-4" data-oid="mao3lhq">
            <div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce"
              data-oid="usqnsu0"
            >
              <CheckCircle
                className="w-10 h-10 text-white"
                data-oid="zh-jgro"
              />
            </div>
            <CardTitle
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid=".w_28o-"
            >
              Payment Successful!
            </CardTitle>
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100"
              data-oid="_hyhl3j"
            >
              Transaction Completed
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6" data-oid="6h.z:e6">
            {/* Transaction Details */}
            <div
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-200"
              data-oid="5dlpaym"
            >
              <h3
                className="font-semibold text-emerald-800 mb-3"
                data-oid="io98qbl"
              >
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm" data-oid="1j61dfl">
                <div className="flex justify-between" data-oid="8sy6kid">
                  <span className="text-emerald-600" data-oid="v_2uf7v">
                    Student:
                  </span>
                  <span
                    className="font-semibold text-emerald-800"
                    data-oid="oaxt9c0"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="j22vfos">
                  <span className="text-emerald-600" data-oid="9tido5s">
                    Amount:
                  </span>
                  <span
                    className="font-bold text-emerald-800 text-lg"
                    data-oid="y5:-672"
                  >
                    ${scannedData?.amount || "50.00"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="i12tw_v">
                  <span className="text-emerald-600" data-oid="0s7ubz:">
                    Transaction ID:
                  </span>
                  <span
                    className="font-mono text-emerald-800 text-xs"
                    data-oid="345qmo0"
                  >
                    TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="ty6jxvy">
                  <span className="text-emerald-600" data-oid="-yew6.b">
                    Time:
                  </span>
                  <span className="text-emerald-800" data-oid="1ttok6k">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Animation */}
            <div className="text-center py-4" data-oid="m-pkgx2">
              <div
                className="inline-flex items-center space-x-2 text-green-600 animate-fade-in"
                data-oid="xob37l-"
              >
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="vwgv5nu"
                ></div>
                <span className="text-sm font-medium" data-oid="desw4.h">
                  Money transferred successfully
                </span>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="zszoiyg"
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3" data-oid="gc9t734">
              <Button
                onClick={onReset}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                data-oid="0tkgdpr"
              >
                <RefreshCw className="w-5 h-5 mr-2" data-oid="f3bfcc." />
                Scan Another QR Code
              </Button>

              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                onClick={() => window.print()}
                data-oid="smr-6.d"
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
