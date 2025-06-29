import React from "react";

const BinanceLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-brand/80 backdrop-blur-sm flex items-center justify-center z-[100]"
      data-oid="qohryjz"
    >
      <div className="flex flex-col items-center space-y-4" data-oid="ff38l10">
        {/* Binance-style loader */}
        <div className="relative" data-oid="pu_pia_">
          <div
            className="w-16 h-16 border-4 border-gray-200 rounded-full"
            data-oid=".7zp1se"
          ></div>
          <div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"
            data-oid="kj6ovv:"
          ></div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center space-x-1" data-oid="16kvopp">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            data-oid="_c0j0fk"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
            data-oid="4s72p:1"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
            data-oid="zkd84i2"
          ></div>
        </div>

        <p className="text-gray-600 font-medium" data-oid=":065n_8">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default BinanceLoader;
