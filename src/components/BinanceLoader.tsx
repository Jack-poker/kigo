import React from "react";

const BinanceLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] bg-brand"
      data-oid="krz4mx_"
    >
      <div className="flex flex-col items-center space-y-4" data-oid="mu_rdhs">
        {/* Binance-style loader */}
        <div className="relative" data-oid="zq1mqbe">
          <div
            className="w-16 h-16 border-4 border-gray-200 rounded-full"
            data-oid="ltxv04w"
          ></div>
          <div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"
            data-oid="ycwpe9q"
          ></div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center space-x-1" data-oid="cvjhscx">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            data-oid="3ofwrr-"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
            data-oid="7jtd0ga"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
            data-oid="y2cwbwe"
          ></div>
        </div>

        <p className="text-white font-medium" data-oid="xfuiuml">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default BinanceLoader;
