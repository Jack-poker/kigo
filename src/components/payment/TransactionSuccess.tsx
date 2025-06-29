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
      data-oid="rx._es4"
    >
      <div className="max-w-md w-full" data-oid="oi4cv_m">
        <Card
          className="border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm animate-scale-in"
          data-oid="nxi_2b2"
        >
          <CardHeader className="text-center pb-4" data-oid="so9-_wt">
            <div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce"
              data-oid="m2:6.og"
            >
              <CheckCircle
                className="w-10 h-10 text-white"
                data-oid="1g5.5yo"
              />
            </div>
            <CardTitle
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid="d6itpic"
            >
              Payment Successful!
            </CardTitle>
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100"
              data-oid="90b2hdo"
            >
              Transaction Completed
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6" data-oid="7yil7n_">
            {/* Transaction Details */}
            <div
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-200"
              data-oid="5jci236"
            >
              <h3
                className="font-semibold text-emerald-800 mb-3"
                data-oid="mqxd:ae"
              >
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm" data-oid="yv.poi6">
                <div className="flex justify-between" data-oid="11kegiw">
                  <span className="text-emerald-600" data-oid="f0o2f23">
                    Student:
                  </span>
                  <span
                    className="font-semibold text-emerald-800"
                    data-oid="a-k0pk4"
                  >
                    {scannedData?.studentName || "John Doe"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="o-exg9t">
                  <span className="text-emerald-600" data-oid="eb1j58x">
                    Amount:
                  </span>
                  <span
                    className="font-bold text-emerald-800 text-lg"
                    data-oid="_de9hm4"
                  >
                    ${scannedData?.amount || "50.00"}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="bqyqyt1">
                  <span className="text-emerald-600" data-oid="hcvrxsb">
                    Transaction ID:
                  </span>
                  <span
                    className="font-mono text-emerald-800 text-xs"
                    data-oid="_dew8i:"
                  >
                    TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between" data-oid="oxx6ang">
                  <span className="text-emerald-600" data-oid="0u4:alq">
                    Time:
                  </span>
                  <span className="text-emerald-800" data-oid="4isd1i8">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Animation */}
            <div className="text-center py-4" data-oid=":iowuf_">
              <div
                className="inline-flex items-center space-x-2 text-green-600 animate-fade-in"
                data-oid="z5cbzl."
              >
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="mi56m09"
                ></div>
                <span className="text-sm font-medium" data-oid="x4ktu_w">
                  Money transferred successfully
                </span>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  data-oid="c3ymwao"
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3" data-oid="9620sr.">
              <Button
                onClick={onReset}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                data-oid="0l2gzph"
              >
                <RefreshCw className="w-5 h-5 mr-2" data-oid="or0rj.-" />
                Scan Another QR Code
              </Button>

              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                onClick={() => window.print()}
                data-oid="5.v_8y_"
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
