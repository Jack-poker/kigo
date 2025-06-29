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
      data-oid="wj0rgeg"
    >
      <div className="max-w-md w-full" data-oid="xm7k7lv">
        <Card
          className="border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm animate-scale-in"
          data-oid="fut3g61"
        >
          <CardHeader className="text-center pb-4" data-oid="sax3qbc">
            <div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce"
              data-oid="-8_hbso"
            >
              <CheckCircle
                className="w-10 h-10 text-white"
                data-oid="f1og.-4"
              />
            </div>
            <CardTitle
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid="u:8oa-h"
            >
              Payment Successful!
            </CardTitle>
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100"
              data-oid="do33hug"
            >
              Transaction Completed
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6" data-oid="0c3d:je">
            {/* Transaction Details */}
            <div
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-200"
              data-oid="4obe5el"
            >
              <h3
                className="font-semibold text-emerald-800 mb-3"
                data-oid="0l15h3s"
              >
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm" data-oid="fqxnbxb">
                <div className="flex justify-between" data-oid="p76_f5c">
                  <span className="text-emerald-600" data-oid="vwj14mg">
                    Student:
                  </span>
                  <span
                    className="font-semibold text-emerald-800"
                    data-oid="-_zim.l"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid=".:0t.cp">
                  <span className="text-emerald-600" data-oid="i3wktjt">
                    Amount:
                  </span>
                  <span
                    className="font-bold text-emerald-800 text-lg"
                    data-oid="r1:2n-o"
                  >
                    ${scannedData?.amount || "50.00"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="u7b30yv">
                  <span className="text-emerald-600" data-oid="y0yvxyj">
                    Transaction ID:
                  </span>
                  <span
                    className="font-mono text-emerald-800 text-xs"
                    data-oid="aookb.d"
                  >
                    TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="iv66kud">
                  <span className="text-emerald-600" data-oid="d0p8m8d">
                    Time:
                  </span>
                  <span className="text-emerald-800" data-oid="h-..8n-">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Animation */}
            <div className="text-center py-4" data-oid="kj74xf3">
              <div
                className="inline-flex items-center space-x-2 text-green-600 animate-fade-in"
                data-oid="re1iq5a"
              >
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="sp9h8pg"
                ></div>
                <span className="text-sm font-medium" data-oid="jab1g6l">
                  Money transferred successfully
                </span>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="pfzpx_a"
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3" data-oid="09r4vtd">
              <Button
                onClick={onReset}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                data-oid="t7:__mk"
              >
                <RefreshCw className="w-5 h-5 mr-2" data-oid="..od_sx" />
                Scan Another QR Code
              </Button>

              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                onClick={() => window.print()}
                data-oid="urpxwm."
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
